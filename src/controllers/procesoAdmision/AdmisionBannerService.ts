import { UploadedFile } from "express-fileupload";
import { CustomError } from "../../errors/CustomErrors";
import { AdmisionBanner } from "../../models/AdmisionBanner";
import path from "path";
import fs from "fs";

export class AdmisionBannerService {
  private readonly UPLOAD_DIR = "uploads/AdmisionBanner";

  constructor() {
    // Asegurar que el directorio de subidas exista
    const uploadPath = path.join(process.cwd(), this.UPLOAD_DIR);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  private validateFileType(file: UploadedFile) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw CustomError.badRequest(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten JPG y PNG.`);
    }
  }

  private cleanupTempFile(file: UploadedFile) {
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }
  }

  private async saveFile(file: UploadedFile): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(process.cwd(), this.UPLOAD_DIR, fileName);
    
    // Mover el archivo desde tempFilePath a uploads/
    await file.mv(filePath);
    
    return `${this.UPLOAD_DIR}/${fileName}`;
  }

  async get(tipo: string = 'GENERAL'): Promise<{
    id: string;
    titulo: string;
    subtitulo: string;
    contactoLabel?: string;
    contactoDepartamento?: string;
    contactoTelefono?: string;
    archivoBuffer?: Buffer;
    archivoMimeType?: string;
    archivoNombre?: string;
  }> {
    const banner = await AdmisionBanner.findOne({ where: { tipo } });
    if (!banner) {
      return { id: '', titulo: '', subtitulo: '' };
    }

    let archivoBuffer: Buffer | undefined;
    let archivoMimeType: string | undefined;
    let archivoNombre: string | undefined;

    if (banner.imagenPath) {
      const fullPath = path.join(process.cwd(), banner.imagenPath);
      if (fs.existsSync(fullPath)) {
        archivoBuffer = fs.readFileSync(fullPath);
        const ext = path.extname(banner.imagenPath).toLowerCase();
        archivoMimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        archivoNombre = path.basename(banner.imagenPath);
      }
    }

    return {
      id: banner.id,
      titulo: banner.titulo,
      subtitulo: banner.subtitulo,
      contactoLabel: banner.contactoLabel,
      contactoDepartamento: banner.contactoDepartamento,
      contactoTelefono: banner.contactoTelefono,
      archivoBuffer,
      archivoMimeType,
      archivoNombre
    };
  }

  async update(data: {
    titulo: string;
    subtitulo: string;
    contactoLabel?: string;
    contactoDepartamento?: string;
    contactoTelefono?: string;
    attachment?: UploadedFile;
  }, tipo: string = 'GENERAL'): Promise<{ id: string }> {
    const { titulo, subtitulo, contactoLabel, contactoDepartamento, contactoTelefono, attachment } = data;

    let banner = await AdmisionBanner.findOne({ where: { tipo } });

    if (!banner) {
      // Create first one
      let imagenPath = '';
      if (attachment) {
        this.validateFileType(attachment);
        imagenPath = await this.saveFile(attachment);
        this.cleanupTempFile(attachment);
      }
      banner = await AdmisionBanner.create({ 
        titulo, 
        subtitulo, 
        contactoLabel, 
        contactoDepartamento, 
        contactoTelefono, 
        imagenPath, 
        tipo 
      });
      return { id: banner.id };
    }

    // Update existing
    banner.titulo = titulo;
    banner.subtitulo = subtitulo;
    if (contactoLabel !== undefined) banner.contactoLabel = contactoLabel;
    if (contactoDepartamento !== undefined) banner.contactoDepartamento = contactoDepartamento;
    if (contactoTelefono !== undefined) banner.contactoTelefono = contactoTelefono;

    if (attachment) {
      this.validateFileType(attachment);
      if (banner.imagenPath) {
        const oldPath = path.join(process.cwd(), banner.imagenPath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      banner.imagenPath = await this.saveFile(attachment);
      this.cleanupTempFile(attachment);
    }

    await banner.save();
    return { id: banner.id };
  }
}
