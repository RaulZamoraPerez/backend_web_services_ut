import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    getInfo,
    updateInfo,
    getBanners,
    getBannersActivos,
    createBanner,
    updateBanner,
    deleteBanner
} from '../controllers/egresadosController';

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/egresados');
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp, gif)'));
        }
    }
});

// Info
router.get('/info', getInfo);
router.put('/info', updateInfo);

// Banners
router.get('/banners', getBanners);
router.get('/banners/activos', getBannersActivos);
router.post('/banners', upload.single('imagen'), createBanner);
router.put('/banners/:id', upload.single('imagen'), updateBanner);
router.delete('/banners/:id', deleteBanner);

export default router;
