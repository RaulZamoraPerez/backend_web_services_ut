import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';
import { verifyDocumentFileType, secureDocumentFileFilter } from './uploadMiddleware';
import NormatividadCategory from '../models/NormatividadCategory';

// Configuración de almacenamiento para normatividad (documentos específicos)
const secureStorageNormatividad = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        const useFolder = async () => {
            const baseUploads = path.join(__dirname, '../../uploads/normatividad');
            try {
                // 1. Try to get category ID from params (create) or body
                let rawCatId = (req.params && (req.params as any).categoriaId) || req.body?.categoriaId;
                let categoriaId = rawCatId ? parseInt(String(rawCatId), 10) : null;

                // 2. If no category ID but we have a document ID (update route /documents/:id), look it up
                if (!categoriaId && req.params.id) {
                    try {
                        // Dynamic import to avoid circular dependency issues if any
                        const NormatividadDocument = (await import('../models/NormatividadDocument')).default;
                        const doc = await NormatividadDocument.findByPk(parseInt(req.params.id, 10));
                        if (doc) {
                            categoriaId = doc.categoriaId;
                        }
                    } catch (e) {
                        console.error('Error looking up document category for upload:', e);
                    }
                }

                let folderName = 'sin_categoria';

                if (categoriaId) {
                    const cat = await NormatividadCategory.findByPk(categoriaId);
                    if (cat) {
                        // Preferir `key` si existe (más estable para nombres de carpeta)
                        if ((cat as any).key) {
                            folderName = String((cat as any).key).trim().toLowerCase().replace(/[^a-z0-9-_]/gi, '_').substring(0, 120);
                        } else if (cat.titulo) {
                            // sanitize title to folder-friendly name
                            folderName = String(cat.titulo).trim().toLowerCase().replace(/[^a-z0-9-_]/gi, '_').substring(0, 120);
                        } else {
                            folderName = `cat_${categoriaId}`;
                        }
                    }
                }

                const uploadPath = path.join(baseUploads, folderName);
                if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
                cb(null, uploadPath);
            } catch (err) {
                console.error('Error determining upload folder for normatividad:', err);
                // fallback to baseUploads
                if (!fs.existsSync(baseUploads)) fs.mkdirSync(baseUploads, { recursive: true });
                cb(null, baseUploads);
            }
        };

        // call the async folder resolver
        useFolder();
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const sanitizedOriginalName = file.originalname
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .substring(0, 200);
        const filename = `norm_${timestamp}_${randomName}_${sanitizedOriginalName}`;
        cb(null, filename);
    }
});

export const uploadNormatividad = multer({
    storage: secureStorageNormatividad,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 1,
        fieldNameSize: 100,
        fieldSize: 2048,
        fields: 15
    },
    fileFilter: secureDocumentFileFilter
});

export const validateUploadedNormatividad = async (req: Request, res: any, next: any) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Archivo requerido', message: 'Debe proporcionar un archivo para subir' });
    }

    const categoriaId = req.params?.categoriaId ? parseInt(String(req.params.categoriaId), 10) : null;
    if (!categoriaId || Number.isNaN(categoriaId)) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Categoría inválida', message: 'Debe seleccionar una categoría válida' });
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

        const cat = await NormatividadCategory.findByPk(categoriaId);
        if (!cat) {
            fs.unlinkSync(filePath);
            return res.status(404).json({ error: 'Categoría no encontrada', message: 'La categoría seleccionada no existe' });
        }

        // Construir la ruta pública relativa incluyendo subcarpetas
        // Obtener ruta relativa desde la carpeta raíz del proyecto
        const projectRoot = path.join(__dirname, '../../');
        const rel = path.relative(projectRoot, filePath).replace(/\\/g, '/'); // e.g. uploads/normatividad/<cat>/file.pdf
        req.body.archivo = `/${rel}`;
        req.body.archivo_name = req.body.archivo_name || req.file.originalname;

        next();
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(500).json({ error: 'Error procesando archivo', message: 'No se pudo validar el archivo' });
    }
};

export const validateUploadedNormatividadOptional = (req: Request, res: any, next: any) => {
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

        // Construir la ruta pública relativa incluyendo subcarpetas
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
