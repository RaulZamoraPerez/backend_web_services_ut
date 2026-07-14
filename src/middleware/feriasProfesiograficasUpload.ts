import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const uploadFeriasProfesiograficasImagen = (req: Request, res: Response, next: NextFunction) => {
  const uploadPath = path.join(__dirname, '../../uploads/ferias-profesiograficas');
  
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(file.originalname).toLowerCase();
      const filename = `${timestamp}_${randomName}${originalExt}`;
      cb(null, filename);
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, WEBP, GIF)'));
      }
    }
  }).single('imagen');

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (req.file) {
      // Guardar la ruta relativa para que el controlador la use
      (req as any).savedImagePath = `ferias-profesiograficas/${req.file.filename}`;
    }
    next();
  });
};
