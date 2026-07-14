import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { UploadService, SavedFile } from "./UploadService";
import { EmailService } from "../email-service";
import { FormType } from "../../types/formType";
import generateEmailHTML from "../../helpers/htmlEmail";
import { CustomError } from "../../errors/CustomErrors";
import { EmailRoutingService } from "../email-service/EmailRoutingService";

const FILE_PROCESSING_TIMEOUT = 30000; // 30 segundos
const EMAIL_SEND_TIMEOUT = 45000; // 45 segundos

export class UploadController {
  constructor(
    public readonly uploadService: UploadService,
    public readonly emailService: EmailService
  ) { }

  async saveTempFile(req: Request, res: Response) {
    let savedFiles: SavedFile[] = [];
    const startTime = Date.now();

    try {
      if (!EmailService.isTramitesConfigured()) {
        await this.cleanupRequestFiles(req);
        return res.status(503).json({
          ok: false,
          message: 'El servicio de correo para trámites no está configurado. Configure MAILER_EMAIL_TRAMITES en el servidor.',
        });
      }

      // Normaliza archivos del request
      const reqFiles = req.files || undefined;
      const raw = (reqFiles as any)?.attachment as UploadedFile | UploadedFile[] | undefined;
      const files: UploadedFile[] = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
      const tituloFormulario: string = req.body['titulo-formulario'];

      if (!tituloFormulario) {
        await this.cleanupRequestFiles(req);
        throw CustomError.badRequest('El título del formulario es obligatorio.');
      }

      // Validar datos del formulario
      const validationError = this.validateFormData(req.body);
      if (validationError) {
        await this.cleanupRequestFiles(req);
        throw CustomError.badRequest(validationError);
      }

      const infoForm: FormType = {
        nombre: req.body.nombre!,
        matricula: req.body.matricula!,
        email: req.body.email!,
        telefono: req.body.telefono!,
        carrera: req.body.carrera!,
        nivel: req.body.nivel,
        entrega: req.body.entrega,
        'documentos-solicitados': req.body['documentos-solicitados'],
        referencia: req.body.referencia,
        'numero-seguro': req.body['numero-seguro'],
        attachment: raw,
        comentarios: req.body.comentarios
      };

      //* Determina los correos destino: responsable + admin (ahora async)
      const destinationEmails = await EmailRoutingService.getAllDestinations(
        infoForm.nivel || 'TSU',
        infoForm.carrera
      );

      // Si no hay archivos, envía correo sin adjunto
      if (files.length === 0) {
        try {
          console.log(`📧 Enviando email sin adjuntos para: ${infoForm.nombre}`);
          // -----------------------------------------------------
          // Enviar correo de forma asíncrona (sin bloquear respuesta)
          // -----------------------------------------------------
          const subject = `${infoForm.nombre || 'Alumno'} - Solicitud de ${tituloFormulario}`;
          
          this.emailService.sendEmail({
            to: destinationEmails,
            subject: subject,
            htmlBody: generateEmailHTML(infoForm, tituloFormulario),
          }).then(info => {
            console.log(`✅ Email sin adjuntos enviado exitosamente. MessageId: ${info.messageId}`);
          }).catch(error => {
            console.error('❌ Error enviando email sin adjunto en background:', error);
          });

          console.log(`🚀 Petición procesada en ${Date.now() - startTime}ms. El email se enviará en segundo plano.`);
          return res.status(200).json({
            ok: true,
            message: 'Email will be sent in background',
            sentTo: destinationEmails,
            emailInfo: { async: true }
          });
        } catch (error: any) {
          console.error('❌ Error general procesando solicitud sin adjunto:', {
            error: error.message,
            nombre: infoForm.nombre,
            timestamp: new Date().toISOString(),
          });
          return res.status(502).json({
            ok: false,
            message: 'Error procesando solicitud sin adjunto',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
        }
      }

      // Procesar archivos adjuntos con timeout
      try {
        console.log(`📄 Procesando ${files.length} archivo(s) para: ${infoForm.nombre}`);

        savedFiles = await Promise.race([
          Promise.all(files.map(f => this.uploadService.savedFile(f))),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('File processing timeout')), FILE_PROCESSING_TIMEOUT)
          )
        ]);

        console.log(`✅ Archivos procesados exitosamente: ${savedFiles.length}`);

        // Limpiar archivos temporales del middleware si son diferentes
        await Promise.allSettled(files.map(async (f, i) => {
          const tmp = (f as any).tempFilePath as string | undefined;
          if (tmp && tmp !== savedFiles[i].tempFilePath) {
            try {
              await this.uploadService.deleteFile(tmp);
            } catch (e) {
              console.warn('No se pudo eliminar archivo temporal:', tmp);
            }
          }
        }));

        // -----------------------------------------------------
        // Enviar correo de forma asíncrona (sin bloquear respuesta)
        // -----------------------------------------------------
        const subject = `${infoForm.nombre || 'Alumno'} - Solicitud de ${tituloFormulario}`;

        this.emailService.sendEmail({
          to: destinationEmails,
          subject: subject,
          htmlBody: generateEmailHTML(infoForm, tituloFormulario),
          attachments: savedFiles.map(sf => ({
            filename: sf.filename,
            path: sf.tempFilePath,
            contentType: sf.mimetype
          }))
        }).then(info => {
          console.log(`✅ Email con adjuntos enviado exitosamente. MessageId: ${info.messageId}`);
        }).catch(error => {
          console.error('❌ Error enviando email con adjuntos en background:', error);
        }).finally(() => {
          // Limpieza final de todos los guardados DESPUÉS de intentar enviar el correo
          Promise.allSettled(savedFiles.map(sf =>
            this.uploadService.deleteFile(sf.tempFilePath).catch(e =>
              console.warn('Error limpiando archivo:', sf.tempFilePath, e)
            )
          ));
        });

        console.log(`🚀 Petición procesada en ${Date.now() - startTime}ms. El email y adjuntos se enviarán en segundo plano.`);

        return res.status(200).json({
          ok: true,
          message: 'Files uploaded and email sent in background',
          sentTo: destinationEmails,
          attachments: savedFiles.map(sf => sf.filename),
          emailInfo: { async: true },
          processingTime: `${Date.now() - startTime}ms`
        });
      } catch (error: any) {
        console.error('❌ Error processing files or sending email:', {
          error: error.message,
          nombre: infoForm.nombre,
          filesCount: files.length,
          timestamp: new Date().toISOString(),
        });

        // Limpieza defensiva
        await this.cleanupSavedFiles(savedFiles);
        await this.cleanupRequestFiles(req, files);

        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ ok: false, message: error.message });
        }

        if (error.message.includes('timeout')) {
          return res.status(504).json({
            ok: false,
            message: 'Request timeout: El procesamiento tardó demasiado',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          });
        }

        return res.status(500).json({
          ok: false,
          message: 'Error uploading files or sending email',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    } catch (error: any) {
      console.error('❌ Error general en saveTempFile:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      // Limpieza defensiva final
      await this.cleanupSavedFiles(savedFiles);
      await this.cleanupRequestFiles(req);

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ ok: false, message: error.message });
      }

      return res.status(500).json({
        ok: false,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  private validateFormData(body: any): string | null {
    if (!body.nombre || body.nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (!body.matricula || body.matricula.trim().length !== 8) {
      return 'La matrícula debe tener 8 caracteres';
    }
    if (!body.email || !body.email.includes('@')) {
      return 'Email inválido';
    }
    if (!body.telefono || body.telefono.trim().length !== 10) {
      return 'El teléfono debe tener 10 caracteres';
    }
    if (!body.carrera || body.carrera.trim().length === 0) {
      return 'La carrera es requerida';
    }
    return null;
  }

  private async cleanupSavedFiles(savedFiles: SavedFile[]): Promise<void> {
    if (!savedFiles || savedFiles.length === 0) return;

    await Promise.allSettled(savedFiles.map(sf =>
      this.uploadService.deleteFile(sf.tempFilePath).catch(e =>
        console.warn('Error en limpieza de archivo:', sf.tempFilePath)
      )
    ));
  }

  private async cleanupRequestFiles(req: Request, files?: UploadedFile[]): Promise<void> {
    try {
      const reqFiles = req.files || undefined;
      const raw = (reqFiles as any)?.attachment as UploadedFile | UploadedFile[] | undefined;
      const filesToClean = files || (raw ? (Array.isArray(raw) ? raw : [raw]) : []);

      await Promise.allSettled(filesToClean.map(async f => {
        const tmp = (f as any)?.tempFilePath as string | undefined;
        if (tmp) {
          try {
            await this.uploadService.deleteFile(tmp);
          } catch (e) {
            console.warn('Error en limpieza de archivo temporal:', tmp);
          }
        }
      }));
    } catch (e) {
      console.warn('Error en cleanupRequestFiles:', e);
    }
  }
}