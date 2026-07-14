import { Router } from 'express';
import * as extensionController from '../controllers/extensionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadExtension, uploadExtensionDocuments, validateUploadedFile, uploadDocumentos, validateUploadedDocument } from '../middleware/uploadMiddleware';
import * as DocumentosController from '../controllers/DocumentsController';
import DocumentosService from '../services/documentosService';
import Categorias from '../models/Categorias';

const router = Router();

// Sections & Items
router.get('/sections/:slug', extensionController.getSection);
router.post('/sections', extensionController.createSection);
router.put('/sections/:slug', extensionController.updateSection);
router.delete('/sections/:slug', extensionController.deleteSection);

router.post('/sections/:slug/toggle-enabled', authenticateToken, extensionController.toggleSectionEnabled);
router.post('/sections/:slug/items', authenticateToken, uploadExtension.single('image'), validateUploadedFile, extensionController.createItem);
// Upload banner for section (authenticated)
router.post('/sections/:slug/upload-image', authenticateToken, uploadExtension.single('image'), validateUploadedFile, extensionController.uploadSectionBanner);
router.put('/items/:id', authenticateToken, uploadExtension.single('image'), validateUploadedFile, extensionController.updateItem);
router.delete('/items/:id', extensionController.deleteItem);

// Documents (Gacetas / Promoción Institucional)
// These extension endpoints are proxies to the central Documentos module (areas/categorias/archivos)
const mapCategoryToAreaId = (category: string) => {
  if (!category) return null;
  const c = category.toLowerCase();
  if (c === 'promocion' || c === 'promoción') return 10;
  return 9; // default to Gacetas
};

router.get('/documents/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const areaId = mapCategoryToAreaId(category);
    if (!areaId) return res.status(400).json({ message: 'Categoría inválida' });
    const archivos = await DocumentosService.getFilesByArea(areaId);
    res.json(archivos);
  } catch (error) {
    next(error);
  }
});

// Upload / create into central Archivos table
// Backwards-compatible extension-specific API: alias for extension-universitaria endpoints
router.get('/universitaria/documents/:category', extensionController.getDocuments);

// Create a document stored under extension-universitaria/documents; allows images and pdfs
router.post('/universitaria/documents', authenticateToken, uploadExtensionDocuments.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), extensionController.createDocument);

router.delete('/universitaria/documents/:id', authenticateToken, extensionController.deleteDocument);

router.post('/documents', authenticateToken, uploadDocumentos.single('archivo'), validateUploadedDocument, async (req, res, next) => {
  try {
    // If client provided ID_Categorias we keep it; else we map category name to a category id
    let { ID_Categorias, category } = req.body as any;
    if (!ID_Categorias) {
      // Map category name 'gaceta'/'promocion' to category ID in DB
      const areaId = mapCategoryToAreaId(String(category));
      if (!areaId) {
        return res.status(400).json({ message: 'ID_Categorias o category es requerido' });
      }
      // Buscar la categoria en la BD
      const cat = await Categorias.findOne({ where: { ID_Area: areaId } });
      if (!cat) {
        return res.status(400).json({ message: 'Categoría no encontrada para esta área' });
      }
      ID_Categorias = cat.ID_Categorias;
    }

    // Set ID_Categorias in body to let DocumentsController.subirArchivo validate
    req.body.ID_Categorias = Number(ID_Categorias);

    // Delegate to DocumentsController.subirArchivo which uses DocumentosService
    return DocumentosController.subirArchivo(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/documents/:id', authenticateToken, async (req, res, next) => {
  try {
    // Reuse central controller
    return DocumentosController.eliminarArchivo(req, res, next);
  } catch (error) {
    next(error);
  }
});

// If someone wants to use the centralized 'documents' route to interact with extension items,
// keep the legacy endpoints but forward extension removal to DocumentsController.
// No further changes required here.

export default router;
