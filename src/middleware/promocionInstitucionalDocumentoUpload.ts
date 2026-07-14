import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';
import { verifyDocumentFileType, secureDocumentFileFilter } from './uploadMiddleware';

const secureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/promocion_institucional/documentos');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const sanitizedOriginalName = file.originalname
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .substring(0, 200);
        const filename = `ecdoc_${timestamp}_${randomName}_${sanitizedOriginalName}`;
        cb(null, filename);
    }
});

export const uploadPromocionInstitucionalDocumento = multer({
    storage: secureStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 1,
        fieldNameSize: 100,
        fieldSize: 2048,
        fields: 15
    },
    fileFilter: secureDocumentFileFilter
});

export const validateUploadedPromocionInstitucionalDocumento = (req: Request, res: any, next: any) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Archivo requerido', message: 'Debe proporcionar un archivo para subir' });
    }

    const filePath = req.file.path;
    try {
        const buffer = fs.readFileSync(filePath, { flag: 'r' });
        const isValidType = verifyDocumentFileType(buffer.slice(0, 20), req.file.mimetype);

        if (!isValidType) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Archivo inválido', message: 'El archivo no corresponde al tipo declarado' });
        }

        if (buffer.length < 50) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Archivo inválido', message: 'El archivo parece estar corrupto o vacío' });
        }

        const projectRoot = path.join(__dirname, '../../');
        const rel = path.relative(projectRoot, filePath).replace(/\\/g, '/');
        req.body.archivo = `/${rel}`;
        req.body.archivo_name = req.body.archivo_name || req.file.originalname;

        next();
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(500).json({ error: 'Error procesando archivo', message: 'No se pudo validar el archivo' });
    }
};

export const validateUploadedPromocionInstitucionalDocumentoOptional = (req: Request, res: any, next: any) => {
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;
    try {
        const buffer = fs.readFileSync(filePath, { flag: 'r' });
        const isValidType = verifyDocumentFileType(buffer.slice(0, 20), req.file.mimetype);

        if (!isValidType) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Archivo inválido', message: 'El archivo no corresponde al tipo declarado' });
        }

        if (buffer.length < 50) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Archivo inválido', message: 'El archivo parece estar corrupto o vacío' });
        }

        const projectRoot = path.join(__dirname, '../../');
        const rel = path.relative(projectRoot, filePath).replace(/\\/g, '/');
        req.body.archivo = `/${rel}`;
        req.body.archivo_name = req.body.archivo_name || req.file.originalname;

        next();
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(500).json({ error: 'Error procesando archivo', message: 'No se pudo validar el archivo' });
    }
};
