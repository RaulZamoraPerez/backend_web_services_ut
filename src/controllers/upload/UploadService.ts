import { UploadedFile } from "express-fileupload";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { randomUUID } from 'crypto';
import { CustomError } from "../../errors/CustomErrors";


const TEMP_DIR = path.resolve(process.cwd(), 'temp_uploads'); // misma carpeta que el middleware

export interface SavedFile {
  tempFilePath: string;
  filename: string;
  mimetype: string;
}



export class UploadService {
  constructor() {

  }


  async savedFile(
    file: UploadedFile | undefined
  ): Promise<SavedFile> {


    //* Se verifica que exista la carpeta "temp_uploads"
    try {


      if (!file) {
        throw CustomError.badRequest('No file uploaded.');
      }

      const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.mimetype)) {
        // limpia el temporal creado por express-fileupload
        const tmp = (file as any).tempFilePath as string | undefined;
        if (tmp) { try { await this.deleteFile(tmp); } catch { } } // no propagar
        throw CustomError.UnsuportedMedia('Invalid file type. Only PDF and images are allowed.');
      }

      // Tamaño máximo 5MB
      const MAX = 5 * 1024 * 1024;
      const truncated = (file as any).truncated as boolean | undefined; // express-fileupload marca esto si se excede el limit
      if (truncated || file.size > MAX) {
        const tmp = (file as any).tempFilePath as string | undefined;
        if (tmp) { try { await this.deleteFile(tmp); } catch { } }
        throw CustomError.payloadTooLarge('El archivo no debe superar 5 MB.');
      }


      if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR, { recursive: true });
      }

      //*Generacion de nombre unico y guardado del archivo
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext).replace(/\s+/g, '_');
      const uniqueName = `${baseName}_${randomUUID()}_${Date.now()}${ext}`; // <- nombre único
      const newPath = path.join(TEMP_DIR, uniqueName);
      await file.mv(newPath);

      return {
        tempFilePath: newPath,
        filename: uniqueName,
        mimetype: file.mimetype
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      // no exponer detalles
      throw CustomError.internalServer('Error saving file');
    }

  }


  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch {
      // limpieza silenciosa (no convertir en 500 un flujo exitoso)
    }
  }
}
