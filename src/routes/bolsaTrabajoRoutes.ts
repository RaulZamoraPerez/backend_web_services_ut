import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    getBolsaTrabajo,
    createHeader,
    updateHeader,
    deleteHeader,
    createItem,
    updateItem,
    deleteItem
} from '../controllers/bolsaTrabajoController';
import { getBolsaTrabajoTitulo, updateBolsaTrabajoTitulo } from '../controllers/BolsaTrabajoTituloController';

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/bolsa-trabajo');
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
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png) y PDFs'));
        }
    }
});

router.get('/', getBolsaTrabajo);
router.get('/titulo', getBolsaTrabajoTitulo);
router.put('/titulo', updateBolsaTrabajoTitulo);

router.post('/header', upload.single('imagen_banner'), createHeader);
router.put('/header/:id', upload.single('imagen_banner'), updateHeader);
router.delete('/header/:id', deleteHeader);
router.post('/items', upload.single('archivo_pdf'), createItem);
router.put('/items/:id', upload.single('archivo_pdf'), updateItem);
router.delete('/items/:id', deleteItem);

export default router;
