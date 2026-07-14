import { UploadedFile } from "express-fileupload";
import { CustomError } from "../../errors/CustomErrors";
import { ProcesoAdmision } from "../../models/ProcesoAdmision";
import { PasoAdmision } from "../../models/PasoAdmision";
import path from "path";
import fs from "fs";

interface PasoData {
  nombre: string;
  descripcion?: string;
  tipo: 'link' | 'file';
  url: string;
}

interface ProcesoAdmisionData {
  titulo: string;
  subtitulo: string;
  attachment?: UploadedFile;
  pasos?: PasoData[];
}

interface ProcesoAdmisionResponse {
  id: string;
  titulo: string;
  subtitulo: string;
  archivoPath: string;
  createdAt: Date;
  pasos?: any[];
}

export class ProcesoAdmisionService {

  // Tipos MIME permitidos y su extensión correspondiente
  private readonly mimeToExtension: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "application/pdf": ".pdf"
  };
  private readonly uploadDir = path.join(process.cwd(), "uploads", "ProcesoAdmision");

  constructor() {
    // Crear la carpeta si no existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Valida que el archivo sea de tipo JPG, JPEG, PNG o PDF usando el MIME type
   */
  private validateFileType(file: UploadedFile): void {
    const mimetype = file.mimetype.toLowerCase();

    if (!this.mimeToExtension[mimetype]) {
      throw CustomError.invalidFileType(
        `Tipo de archivo no permitido. Solo se aceptan JPG, PNG y PDF. Tipo recibido: ${file.mimetype}`
      );
    }
  }

  /**
   * Obtiene la extensión correcta basándose en el MIME type
   */
  private getExtensionFromMime(mimetype: string): string {
    return this.mimeToExtension[mimetype.toLowerCase()] || ".jpg";
  }

  /**
   * Guarda el archivo en uploads/ProcesoAdmision y retorna el path
   */
  private async saveFile(file: UploadedFile): Promise<string> {
    // Generar nombre único usando el MIME type para la extensión correcta
    const timestamp = Date.now();
    const baseName = path.basename(file.name, path.extname(file.name));
    const safeName = baseName.replace(/[^a-zA-Z0-9-]/g, "_");
    const extension = this.getExtensionFromMime(file.mimetype);
    const fileName = `${timestamp}-${safeName}${extension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Mover el archivo
    await file.mv(filePath);

    // Retornar el path relativo para guardar en BD
    return `/uploads/ProcesoAdmision/${fileName}`;
  }

  /**
   * Elimina el archivo temporal si existe
   */
  private cleanupTempFile(file: UploadedFile): void {
    try {
      if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
        fs.unlinkSync(file.tempFilePath);
      }
    } catch (error) {
      console.error("Error al eliminar archivo temporal:", error);
    }
  }

  /**
   * Procesa y guarda la información del proceso de admisión
   * Elimina el registro existente (si hay) antes de crear uno nuevo
   */
  async create(data: ProcesoAdmisionData, tipo: string = 'GENERAL'): Promise<ProcesoAdmisionResponse> {
    const { titulo, subtitulo, attachment, pasos } = data;

    // Validar que el campo attachment exista
    if (!attachment) {
      throw CustomError.badRequest("El campo 'attachment' es requerido.");
    }

    try {
      // 2. Validar tipo de archivo
      this.validateFileType(attachment);

      // 3. Guardar archivo en uploads/ProcesoAdmision
      const archivoPath = await this.saveFile(attachment);

      // 4. Guardar en la base de datos
      const registro = await ProcesoAdmision.create({
        titulo,
        subtitulo,
        archivoPath,
        tipo
      });
      // Guardar pasos si los hay
      let pasosCreados: any[] = [];
      if (pasos && Array.isArray(pasos) && pasos.length > 0) {
        const pasosToCreate = pasos.map((p, index) => ({
          procesoAdmisionId: registro.id,
          nombre: p.nombre,
          descripcion: p.descripcion || '',
          tipo: p.tipo || 'link',
          url: p.url || '',
          orden: index
        }));
        pasosCreados = await PasoAdmision.bulkCreate(pasosToCreate);
      }

      // 5. Limpiar archivo temporal
      this.cleanupTempFile(attachment);

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        archivoPath: registro.archivoPath,
        createdAt: registro.createdAt,
        pasos: pasosCreados
      };

    } catch (error) {
      // Limpiar archivo temporal en caso de error
      this.cleanupTempFile(attachment);

      // Re-lanzar si es CustomError
      if (error instanceof CustomError) {
        throw error;
      }

      // Error genérico
      console.error("Error en ProcesoAdmisionService.create:", error);
      throw CustomError.internalServer(
        `Error al procesar el registro de admisión: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene TODAS las convocatorias activas (ProcesoAdmision)
   */
  async getAll(tipo: string = 'GENERAL'): Promise<Array<{
    id: string;
    titulo: string;
    subtitulo: string;
    archivoBuffer: Buffer;
    archivoMimeType: string;
    archivoNombre: string;
    pasos: any[];
  }>> {
    // Buscar todos los registros con sus pasos
    const registros = await ProcesoAdmision.findAll({
      where: { tipo },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: PasoAdmision,
          as: 'pasos'
        }
      ]
    });

    const resultados = [];

    for (const registro of registros) {
      // Obtener el tipo MIME basado en la extensión
      const archivoExt = path.extname(registro.archivoPath).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
      };
      const archivoMimeType = mimeTypes[archivoExt] || 'application/octet-stream';

      // Leer el archivo si existe
      let archivoBuffer = Buffer.alloc(0);
      const fullPath = path.join(process.cwd(), registro.archivoPath);
      if (fs.existsSync(fullPath)) {
        archivoBuffer = fs.readFileSync(fullPath);
      }

      // Obtener el nombre del archivo
      const archivoNombre = path.basename(registro.archivoPath);

      // Obtener los pasos asociados si los hay
      let pasosOrdenados = [];
      if ((registro as any).pasos) {
        pasosOrdenados = (registro as any).pasos.sort((a: any, b: any) => a.orden - b.orden);
      }

      resultados.push({
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        archivoBuffer,
        archivoMimeType,
        archivoNombre,
        pasos: pasosOrdenados
      });
    }

    return resultados;
  }

  /**
   * Elimina un registro del proceso de admisión por ID
   */
  async delete(id: string): Promise<{ message: string }> {
    // Buscar el registro
    const registro = await ProcesoAdmision.findByPk(id);

    if (!registro) {
      throw CustomError.notFound(`No se encontró el registro con ID: ${id}`);
    }

    // Eliminar el archivo físico
    const archivoAbsolutePath = path.join(process.cwd(), registro.archivoPath);
    if (fs.existsSync(archivoAbsolutePath)) {
      fs.unlinkSync(archivoAbsolutePath);
    }

    // Eliminar el registro de la base de datos
    await registro.destroy();

    return { message: "Registro eliminado exitosamente" };
  }

  /**
   * Actualiza un registro del proceso de admisión por ID
   */
  async update(id: string, data: {
    titulo?: string;
    subtitulo?: string;
    attachment?: UploadedFile;
    pasos?: PasoData[];
  }): Promise<ProcesoAdmisionResponse> {
    const { titulo, subtitulo, attachment, pasos } = data;

    // Buscar el registro
    const registro = await ProcesoAdmision.findByPk(id);

    if (!registro) {
      throw CustomError.notFound(`No se encontró el registro con ID: ${id}`);
    }

    try {
      // Actualizar campos de texto si vienen
      if (titulo) registro.titulo = titulo;
      if (subtitulo) registro.subtitulo = subtitulo;

      // Si viene un nuevo archivo, validar, guardar y eliminar el anterior
      if (attachment) {
        // Validar tipo de archivo
        this.validateFileType(attachment);

        // Eliminar archivo anterior
        const archivoAnteriorPath = path.join(process.cwd(), registro.archivoPath);
        if (fs.existsSync(archivoAnteriorPath)) {
          fs.unlinkSync(archivoAnteriorPath);
        }

        // Guardar nuevo archivo
        const nuevoArchivoPath = await this.saveFile(attachment);
        registro.archivoPath = nuevoArchivoPath;

        // Limpiar archivo temporal
        this.cleanupTempFile(attachment);
      }

      // Guardar cambios en la base de datos principal
      await registro.save();

      // Procesar pasos si vienen en la petición
      let pasosCreados: any[] = [];
      if (pasos !== undefined) {
        // Borrar los pasos anteriores
        await PasoAdmision.destroy({ where: { procesoAdmisionId: registro.id } });

        // Crear los nuevos
        if (Array.isArray(pasos) && pasos.length > 0) {
          const pasosToCreate = pasos.map((p, index) => ({
            procesoAdmisionId: registro.id,
            nombre: p.nombre,
            descripcion: p.descripcion || '',
            tipo: p.tipo || 'link',
            url: p.url || '',
            orden: index
          }));
          pasosCreados = await PasoAdmision.bulkCreate(pasosToCreate);
        }
      } else {
        // Si no vienen pasos, cargamos los que ya tiene
        pasosCreados = await PasoAdmision.findAll({ 
          where: { procesoAdmisionId: registro.id },
          order: [['orden', 'ASC']]
        });
      }

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        archivoPath: registro.archivoPath,
        createdAt: registro.createdAt,
        pasos: pasosCreados
      };

    } catch (error) {
      // Limpiar archivo temporal en caso de error
      if (attachment) {
        this.cleanupTempFile(attachment);
      }

      // Re-lanzar si es CustomError
      if (error instanceof CustomError) {
        throw error;
      }

      // Error genérico
      console.error("Error en ProcesoAdmisionService.update:", error);
      throw CustomError.internalServer(
        `Error al actualizar el registro: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }
}
