import { Router } from "express";
import {
  getPortalConfig,
  updatePortalConfig,
  uploadPortalImage,
  deletePortalImage
} from "../controllers/portalEstudiantesController";

// Middleware de seguridad
import { authenticateToken } from '../middleware/auth';
// Middleware de upload
import { uploadNosotros, validateUploadedFile } from '../middleware/uploadMiddleware';

const router = Router();

// ============================================
// RUTAS PARA PORTAL ESTUDIANTES
// ============================================

// GET /api/portal-estudiantes - Obtener configuración del portal (público)
router.get("/", getPortalConfig);

// PUT /api/portal-estudiantes - Actualizar configuración (requiere autenticación)
router.put("/", authenticateToken, updatePortalConfig);

// POST /api/portal-estudiantes/upload-image - Subir imagen (requiere autenticación)
router.post("/upload-image", 
  authenticateToken, 
  uploadNosotros.single('image'), 
  validateUploadedFile, 
  uploadPortalImage
);

// DELETE /api/portal-estudiantes/image/:filename - Eliminar imagen (requiere autenticación)
router.delete("/image/:filename", authenticateToken, deletePortalImage);

export default router;
