import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import {
  obtenerDocumentosPublicos,
  obtenerCategoriasAdmin,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerDocumentosAdmin,
  crearDocumento,
  actualizarDocumento,
  eliminarDocumento
} from '../controllers/portalDocenteDocumentosController';

const router = Router();

// Configuración de Multer para archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../../uploads/portal_docente/documentos');
    require('fs').mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'portaldocente-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.get('/publicos', obtenerDocumentosPublicos);

// ==========================================
// RUTAS DE CATEGORÍAS (ADMIN)
// ==========================================
router.get('/categorias', obtenerCategoriasAdmin);
router.post('/categorias', crearCategoria);
router.put('/categorias/:id', actualizarCategoria);
router.delete('/categorias/:id', eliminarCategoria);

// ==========================================
// RUTAS DE DOCUMENTOS (ADMIN)
// ==========================================
router.get('/', obtenerDocumentosAdmin);

// Ruta para subir archivo
router.post('/upload', upload.single('archivo'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No se subió ningún archivo' });
    return;
  }
  const relativePath = `/uploads/portal_docente/documentos/${req.file.filename}`;
  res.json({ url: relativePath });
});

router.post('/', crearDocumento);
router.put('/:id', actualizarDocumento);
router.delete('/:id', eliminarDocumento);

export default router;
