import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    getEncuentroEgresados,
    createEncuentroEgresados,
    updateEncuentroEgresados,
    deleteEncuentroEgresados
} from '../controllers/encuentroEgresadosController';

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/encuentro-egresados');
        // Asegurar que el directorio existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes y archivos PDF'));
        }
    }
});

// Rutas
router.get('/', getEncuentroEgresados);
router.post('/', upload.single('archivo'), createEncuentroEgresados);
router.put('/:id', updateEncuentroEgresados);
router.delete('/:id', deleteEncuentroEgresados);

export default router;
