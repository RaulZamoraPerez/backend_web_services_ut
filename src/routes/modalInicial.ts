import { Router } from 'express';
import * as modalInicialController from '../controllers/modalInicialController';
import { uploadNoticias, saveNoticiaFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Middleware especial para subida múltiple (imagen y pdf)
// Usamos uploadNoticias.fields para permitir ambos archivos
import multer from 'multer';
import path from 'path';

// Re-crear un pequeño storage para subir PDFs y Fotos en la misma carpeta o adaptarlo
// Como uploadNoticias usa diskStorage a uploads/noticias, podemos usar ese mismo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/noticias');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadModal = multer({ storage });

router.get('/', modalInicialController.getConfig);

router.put(
  '/',
  authenticateToken,
  uploadModal.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]),
  modalInicialController.updateConfig
);

export default router;
