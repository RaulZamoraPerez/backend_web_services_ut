import { Router } from 'express';
import { getAllDocumentos, createDocumento, updateDocumento, deleteDocumento } from '../controllers/vinculacionBannerController';
import { getTitulo, updateTitulo } from '../controllers/VinculacionBannerTituloController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadVinculacionImagen } from '../middleware/vinculacionUpload';

const router = Router();

// Rutas de Título (deben ir antes de las rutas con :id para no crear conflicto)
router.get('/titulo', getTitulo);
router.put('/titulo', authenticateToken, requireAdmin, updateTitulo);

// Rutas públicas
router.get('/', getAllDocumentos);

// Rutas protegidas
router.post('/', authenticateToken, requireAdmin, uploadVinculacionImagen, createDocumento);
router.put('/:id', authenticateToken, requireAdmin, uploadVinculacionImagen, updateDocumento);
router.delete('/:id', authenticateToken, requireAdmin, deleteDocumento);

export default router;
