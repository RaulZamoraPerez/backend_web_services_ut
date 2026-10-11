import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import QuejasConfig from '../models/QuejasConfig';
import QuejaSugerencia from '../models/QuejaSugerencia';
import generateQuejaEmailHTML from '../helpers/htmlQuejaEmail';
import { EmailService } from './email-service/EmailService';

// Generar Folio Institucional Único
function generateFolio(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `QYS-${year}${month}${day}-${randomHex}`;
}

// 1. Obtener la configuración del buzón
export const getQuejasConfig = async (_req: Request, res: Response): Promise<void> => {
  try {
    let config = await QuejasConfig.findOne();
    if (!config) {
      config = await QuejasConfig.create({
        destination_email: 'quejas@uttecam.edu.mx',
        titulo: 'Buzón de Quejas y Sugerencias',
        indicaciones: 'Atención directa y confidencial para la comunidad universitaria de la UTTECAM.',
        objetivo: 'Garantizar un entorno universitario seguro a través de su atención oportuna, el logro de acuerdos entre partes y/o su canalización a las diversas Unidades Administrativas u Órganos Colegiados Institucionales para que estos emitan las determinaciones correspondientes, lo anterior, con la finalidad de incrementar la satisfacción de estudiantes, docentes, personal administrativo y partes interesadas;',
        telefono: '249 42 2 33 10',
        ubicacion: 'Edificio H, planta alta',
        card1_titulo: 'Confidencialidad',
        card1_descripcion: 'Tu información está protegida. Todas las solicitudes recibidas en este buzón se manejan con absoluta reserva y estricta confidencialidad.',
        card2_titulo: 'Compromiso UTTECAM',
        card2_descripcion: 'Cada petición es analizada con seriedad, dando respuesta formal en un término de 3 a 5 días hábiles conforme a las normativas institucionales.',
        banner_titulo: 'Tu voz construye una mejor universidad',
        banner_descripcion: 'Juntos creamos un entorno educativo digno, transparente y de calidad para toda la comunidad tecnológica.',
        portal_tag: 'Portal Institucional',
        boton_superior_texto: 'Enviar Queja o Sugerencia',
        formulario_tag: 'Registro Institucional',
        formulario_titulo: 'Formulario de Atención',
        formulario_descripcion: 'Ingresa los datos solicitados para dar inicio y seguimiento formal a tu solicitud.',
        directorio_titulo: 'Directorio Institucional',
        directorio_descripcion: '¿Deseas comunicarte directamente con alguna dirección o departamento universitario?',
        directorio_link_texto: 'Consultar Directorio',
        consideraciones_titulo: 'Considera lo siguiente',
        consideraciones_item1: 'Los datos solicitados son necesarios para dar seguimiento y serán tratados con estricta confidencialidad.',
        consideraciones_item2: 'Al área responsable se le otorga un término de 3 a 5 días hábiles para emitir respuesta formal.',
        aviso_privacidad: '',
        aviso_privacidad_pdf: null,
        aviso_privacidad_pdf_original_name: null,
        activo: true,
      });
    }
    res.json(config);
  } catch (error) {
    console.error('Error fetching quejas config:', error);
    res.status(500).json({ error: 'Error interno al obtener la configuración' });
  }
};

// 2. Actualizar la configuración del buzón (correo receptor, datos de contacto, objetivo, textos y PDF del aviso)
export const updateQuejasConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      destination_email,
      titulo,
      indicaciones,
      objetivo,
      telefono,
      ubicacion,
      aviso_privacidad,
      card1_titulo,
      card1_descripcion,
      card2_titulo,
      card2_descripcion,
      banner_titulo,
      banner_descripcion,
      portal_tag,
      boton_superior_texto,
      formulario_tag,
      formulario_titulo,
      formulario_descripcion,
      directorio_titulo,
      directorio_descripcion,
      directorio_link_texto,
      consideraciones_titulo,
      consideraciones_item1,
      consideraciones_item2,
      activo,
      eliminar_pdf,
    } = req.body;

    if (destination_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination_email.trim())) {
      res.status(400).json({ error: 'El correo electrónico receptor no tiene un formato válido' });
      return;
    }

    let config = await QuejasConfig.findOne();
    let pdfPath: string | null | undefined = undefined;
    let pdfOriginalName: string | null | undefined = undefined;

    if (req.file) {
      pdfPath = `/uploads/quejas-sugerencias/${req.file.filename}`;
      pdfOriginalName = req.file.originalname;

      // Eliminar PDF anterior si existía
      if (config?.aviso_privacidad_pdf) {
        try {
          const oldPdf = path.join(__dirname, '../../', config.aviso_privacidad_pdf);
          if (fs.existsSync(oldPdf)) {
            fs.unlinkSync(oldPdf);
          }
        } catch (e) {
          console.warn('No se pudo borrar el PDF anterior del aviso de privacidad:', e);
        }
      }
    } else if (eliminar_pdf === 'true' || eliminar_pdf === true) {
      pdfPath = null;
      pdfOriginalName = null;
      if (config?.aviso_privacidad_pdf) {
        try {
          const oldPdf = path.join(__dirname, '../../', config.aviso_privacidad_pdf);
          if (fs.existsSync(oldPdf)) {
            fs.unlinkSync(oldPdf);
          }
        } catch (e) {
          console.warn('No se pudo borrar el PDF del aviso de privacidad:', e);
        }
      }
    }

    if (!config) {
      config = await QuejasConfig.create({
        destination_email: destination_email !== undefined ? destination_email.trim() : 'quejas@uttecam.edu.mx',
        titulo: titulo !== undefined ? titulo.trim() : '',
        indicaciones: indicaciones !== undefined ? indicaciones : '',
        objetivo: objetivo !== undefined ? objetivo.trim() : '',
        telefono: telefono !== undefined ? telefono.trim() : '',
        ubicacion: ubicacion !== undefined ? ubicacion.trim() : '',
        aviso_privacidad: aviso_privacidad !== undefined ? aviso_privacidad : '',
        aviso_privacidad_pdf: pdfPath !== undefined ? pdfPath : null,
        aviso_privacidad_pdf_original_name: pdfOriginalName !== undefined ? pdfOriginalName : null,
        card1_titulo: card1_titulo !== undefined ? card1_titulo : '',
        card1_descripcion: card1_descripcion !== undefined ? card1_descripcion : '',
        card2_titulo: card2_titulo !== undefined ? card2_titulo : '',
        card2_descripcion: card2_descripcion !== undefined ? card2_descripcion : '',
        banner_titulo: banner_titulo !== undefined ? banner_titulo : '',
        banner_descripcion: banner_descripcion !== undefined ? banner_descripcion : '',
        portal_tag: portal_tag !== undefined ? portal_tag : '',
        boton_superior_texto: boton_superior_texto !== undefined ? boton_superior_texto : '',
        formulario_tag: formulario_tag !== undefined ? formulario_tag : '',
        formulario_titulo: formulario_titulo !== undefined ? formulario_titulo : '',
        formulario_descripcion: formulario_descripcion !== undefined ? formulario_descripcion : '',
        directorio_titulo: directorio_titulo !== undefined ? directorio_titulo : '',
        directorio_descripcion: directorio_descripcion !== undefined ? directorio_descripcion : '',
        directorio_link_texto: directorio_link_texto !== undefined ? directorio_link_texto : '',
        consideraciones_titulo: consideraciones_titulo !== undefined ? consideraciones_titulo : '',
        consideraciones_item1: consideraciones_item1 !== undefined ? consideraciones_item1 : '',
        consideraciones_item2: consideraciones_item2 !== undefined ? consideraciones_item2 : '',
        activo: activo !== undefined ? Boolean(activo) : true,
      });
    } else {
      if (destination_email !== undefined) config.destination_email = destination_email.trim();
      if (titulo !== undefined) config.titulo = titulo.trim();
      if (indicaciones !== undefined) config.indicaciones = indicaciones;
      if (objetivo !== undefined) config.objetivo = objetivo;
      if (telefono !== undefined) config.telefono = telefono.trim();
      if (ubicacion !== undefined) config.ubicacion = ubicacion.trim();
      if (aviso_privacidad !== undefined) config.aviso_privacidad = aviso_privacidad;
      if (pdfPath !== undefined) {
        config.aviso_privacidad_pdf = pdfPath;
        config.aviso_privacidad_pdf_original_name = pdfOriginalName ?? null;
      }
      if (card1_titulo !== undefined) config.card1_titulo = card1_titulo;
      if (card1_descripcion !== undefined) config.card1_descripcion = card1_descripcion;
      if (card2_titulo !== undefined) config.card2_titulo = card2_titulo;
      if (card2_descripcion !== undefined) config.card2_descripcion = card2_descripcion;
      if (banner_titulo !== undefined) config.banner_titulo = banner_titulo;
      if (banner_descripcion !== undefined) config.banner_descripcion = banner_descripcion;
      if (portal_tag !== undefined) config.portal_tag = portal_tag;
      if (boton_superior_texto !== undefined) config.boton_superior_texto = boton_superior_texto;
      if (formulario_tag !== undefined) config.formulario_tag = formulario_tag;
      if (formulario_titulo !== undefined) config.formulario_titulo = formulario_titulo;
      if (formulario_descripcion !== undefined) config.formulario_descripcion = formulario_descripcion;
      if (directorio_titulo !== undefined) config.directorio_titulo = directorio_titulo;
      if (directorio_descripcion !== undefined) config.directorio_descripcion = directorio_descripcion;
      if (directorio_link_texto !== undefined) config.directorio_link_texto = directorio_link_texto;
      if (consideraciones_titulo !== undefined) config.consideraciones_titulo = consideraciones_titulo;
      if (consideraciones_item1 !== undefined) config.consideraciones_item1 = consideraciones_item1;
      if (consideraciones_item2 !== undefined) config.consideraciones_item2 = consideraciones_item2;
      if (activo !== undefined) config.activo = Boolean(activo);
      await config.save();
    }

    res.json({
      success: true,
      message: 'Configuración actualizada correctamente',
      config,
    });
  } catch (error) {
    console.error('Error updating quejas config:', error);
    res.status(500).json({ error: 'Error interno al actualizar la configuración' });
  }
};

// 3. Registrar una nueva queja / sugerencia y enviar correo
export const submitQueja = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      tipo,
      tipo_otro_texto,
      nombre_completo,
      correo,
      telefono,
      carrera_area,
      fecha,
      descripcion,
    } = req.body;

    // Validar campos obligatorios
    if (!tipo || !nombre_completo || !correo || !telefono || !carrera_area || !descripcion) {
      res.status(400).json({
        error: 'Todos los campos obligatorios deben ser completados (tipo, nombre, correo, teléfono, carrera/área, descripción)',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      res.status(400).json({ error: 'El correo electrónico proporcionado no es válido' });
      return;
    }

    // Manejo de archivo adjunto si existe
    let evidenciaPath: string | null = null;
    let evidenciaOriginalName: string | null = null;
    let evidenciaAbsolutePath: string | null = null;

    if (req.file) {
      evidenciaPath = `/uploads/quejas-sugerencias/${req.file.filename}`;
      evidenciaOriginalName = req.file.originalname;
      evidenciaAbsolutePath = req.file.path;
    }

    // Generar Folio
    let folio = generateFolio();
    let existing = await QuejaSugerencia.findOne({ where: { folio } });
    while (existing) {
      folio = generateFolio();
      existing = await QuejaSugerencia.findOne({ where: { folio } });
    }

    const fechaRegistro = fecha ? String(fecha).trim() : new Date().toISOString().split('T')[0];

    // Guardar en Base de Datos
    const nuevaQueja = await QuejaSugerencia.create({
      folio,
      tipo: tipo.trim(),
      tipo_otro_texto: tipo === 'Otro' ? (tipo_otro_texto ? String(tipo_otro_texto).trim() : null) : null,
      nombre_completo: nombre_completo.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      carrera_area: carrera_area.trim(),
      fecha: fechaRegistro,
      descripcion: descripcion.trim(),
      evidencia_path: evidenciaPath,
      evidencia_original_name: evidenciaOriginalName,
      estado: 'Pendiente',
    });

    // Obtener correo destino configurado
    let config = await QuejasConfig.findOne();
    const destEmail = config && config.destination_email 
      ? config.destination_email 
      : (process.env.MAILER_EMAIL_CONTACTO || 'buzonquejas@uttecam.edu.mx');

    // Preparar contenido de email
    const htmlBody = generateQuejaEmailHTML({
      folio,
      tipo,
      tipo_otro_texto,
      nombre_completo: nombre_completo.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      carrera_area: carrera_area.trim(),
      fecha: fechaRegistro,
      descripcion: descripcion.trim(),
      hasAttachment: Boolean(evidenciaAbsolutePath),
      attachmentName: evidenciaOriginalName || undefined,
    });

    // Preparar adjuntos para nodemailer
    const attachments = [];
    const logoPath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail.png');
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: 'logo-uttecam.png',
        path: logoPath,
        cid: 'logo',
        contentType: 'image/png',
      });
    }

    if (evidenciaAbsolutePath && fs.existsSync(evidenciaAbsolutePath)) {
      attachments.push({
        filename: evidenciaOriginalName || path.basename(evidenciaAbsolutePath),
        path: evidenciaAbsolutePath,
      });
    }

    // Enviar correo electrónico
    try {
      const emailService = EmailService.forContact();
      const tipoLabel = tipo === 'Otro' && tipo_otro_texto ? `Otro (${tipo_otro_texto})` : tipo;
      
      await emailService.sendEmail({
        to: destEmail,
        subject: `[${folio}] Nueva ${tipoLabel}: ${nombre_completo.trim()} - ${carrera_area.trim()}`,
        htmlBody,
        attachments,
      });
      console.log(`✉️ Correo de queja/sugerencia enviado con folio [${folio}] a ${destEmail}`);
    } catch (emailError: any) {
      console.error('⚠️ No se pudo enviar el correo de queja/sugerencia pero se guardó en BD:', emailError.message);
      // No fallamos la petición para no frustrar al usuario, ya que quedó registrado con su folio en la base de datos
    }

    res.status(201).json({
      success: true,
      message: 'Tu solicitud ha sido registrada exitosamente.',
      folio,
      data: nuevaQueja,
    });
  } catch (error: any) {
    console.error('Error submitting queja/sugerencia:', error);
    res.status(500).json({ error: error.message || 'Error interno al procesar la queja o sugerencia' });
  }
};

// 4. Listado para el panel de administración en el Dashboard
export const getQuejasList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const list = await QuejaSugerencia.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(list);
  } catch (error) {
    console.error('Error fetching quejas list:', error);
    res.status(500).json({ error: 'Error al obtener la lista de quejas y sugerencias' });
  }
};

// 5. Actualizar estado y/o respuesta de una queja
export const updateQuejaStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, respuesta } = req.body;

    const queja = await QuejaSugerencia.findByPk(id);
    if (!queja) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    if (estado !== undefined) queja.estado = estado;
    if (respuesta !== undefined) queja.respuesta = respuesta;

    await queja.save();

    res.json({
      success: true,
      message: 'Estado actualizado correctamente',
      queja,
    });
  } catch (error) {
    console.error('Error updating queja status:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};

// 6. Eliminar una queja / sugerencia
export const deleteQueja = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const queja = await QuejaSugerencia.findByPk(id);

    if (!queja) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    // Eliminar archivo adjunto del servidor si existe
    if (queja.evidencia_path) {
      const filePath = path.join(process.cwd(), queja.evidencia_path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('No se pudo borrar el archivo físico de evidencia:', e);
        }
      }
    }

    await queja.destroy();

    res.json({
      success: true,
      message: 'Registro eliminado correctamente',
    });
  } catch (error) {
    console.error('Error deleting queja:', error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
};
