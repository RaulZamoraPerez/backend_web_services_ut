import { Router } from 'express';
import { 
  getAllProductos, 
  createProducto, 
  updateProducto, 
  deleteProducto 
} from '../controllers/productoInvestigacionController';
import { 
  uploadProductosInvestigacion, 
  saveProductosInvestigacionFiles 
} from '../middleware/uploadMiddleware';

const router = Router();

// Rutas públicas
router.get('/', getAllProductos);

// Rutas protegidas (se asume que el middleware de autenticación se aplica en app.ts o aquí si fuera necesario)
router.post('/', uploadProductosInvestigacion, saveProductosInvestigacionFiles, createProducto);
router.put('/:id', uploadProductosInvestigacion, saveProductosInvestigacionFiles, updateProducto);
router.delete('/:id', deleteProducto);

export default router;
