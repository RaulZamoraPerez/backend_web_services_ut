import { Router } from "express";

// Importar controladores de la nueva API simplificada
import {
  getContent,
  updateContent,
  updateSection,
  createContent,
  getSection,
  deleteContent,
  deleteSection,
  uploadImage
} from "../controllers/nosotrosController";

// Middleware de seguridad
import { authenticateToken } from '../middleware/auth';
// Middleware de upload
import { uploadNosotros, validateUploadedFile } from '../middleware/uploadMiddleware';

const router = Router();

// ============================================
// RUTAS PARA LA NUEVA API SIMPLIFICADA
// ============================================

// GET /api/nosotros/content - Obtener todo el contenido de la página "Nosotros"
router.get("/content", getContent);

// POST /api/nosotros/content - Crear nuevo contenido (requiere autenticación)
router.post("/content", authenticateToken, createContent);

// PUT /api/nosotros/content - Actualizar todo el contenido de la página "Nosotros" (requiere autenticación)
router.put("/content", authenticateToken, updateContent);

// DELETE /api/nosotros/content - Eliminar todo el contenido (requiere autenticación)
router.delete("/content", authenticateToken, deleteContent);

// GET /api/nosotros/content/:section - Obtener una sección específica
router.get("/content/:section", getSection);

// PATCH /api/nosotros/content/:section - Actualizar una sección específica del contenido (requiere autenticación)
router.patch("/content/:section", authenticateToken, updateSection);

// DELETE /api/nosotros/content/:section - Restaurar una sección específica a valores por defecto (requiere autenticación)
router.delete("/content/:section", authenticateToken, deleteSection);

// POST /api/nosotros/upload-image - Subir imagen para una sección específica (requiere autenticación)
router.post("/upload-image", authenticateToken, uploadNosotros.single('image'), validateUploadedFile, uploadImage);

export default router;
