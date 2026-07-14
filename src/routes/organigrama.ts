import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllOrganigrama,
  getOrganigramaFlat,
  getOrganigramaById,
  createOrganigrama,
  updateOrganigrama,
  deleteOrganigrama,
  syncOrganigramaFromClient
} from '../controllers/organigramaController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/organigrama');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'org_' + uniqueSuffix + extension);
  }
});

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, WebP y AVIF.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Rutas públicas
router.get('/', getAllOrganigrama);
router.get('/flat', getOrganigramaFlat);
router.get('/:id', getOrganigramaById);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, upload.single('imagen'), createOrganigrama);
router.put('/:id', authenticateToken, upload.single('imagen'), updateOrganigrama);
router.delete('/:id', authenticateToken, deleteOrganigrama);

// Ruta de sincronización
// En desarrollo: sin auth | En producción: con auth
if (process.env.NODE_ENV !== 'production') {
  router.post('/sync', syncOrganigramaFromClient);
} else {
  router.post('/sync', authenticateToken, syncOrganigramaFromClient);
}

export default router;
