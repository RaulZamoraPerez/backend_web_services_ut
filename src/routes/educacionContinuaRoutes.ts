import { Router } from 'express';
import { 
  getInfo, 
  updateInfo, 
  getCursos, 
  getPublicCursos, 
  createCurso, 
  updateCurso, 
  deleteCurso, 
  toggleCursoStatus, 
  updateCursoOrder,
  getVideos,
  getPublicVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleVideoStatus,
  getBanners,
  getPublicBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  updateBannerOrder
} from '../controllers/educacionContinuaController';
import { uploadEducacionContinuaImagen } from '../middleware/educacionContinuaUpload';
import { uploadEducacionContinuaDocumento, validateUploadedEducacionContinuaDocumento, validateUploadedEducacionContinuaDocumentoOptional } from '../middleware/educacionContinuaDocumentoUpload';
import { authenticateToken } from '../middleware/authMiddleware'; // Assuming auth is needed for admin routes

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
} from '../controllers/educacionContinuaDocumentosController';

const router = Router();

// Public routes
router.get('/public/cursos', getPublicCursos);
router.get('/public/videos', getPublicVideos);
router.get('/public/documentos', obtenerDocumentosPublicos);
router.get('/public/banners', getPublicBanners);
router.get('/info', getInfo);

// Admin routes (protected)
router.put('/info', authenticateToken, updateInfo);

// Cursos Admin
router.get('/cursos', authenticateToken, getCursos);
router.post('/cursos', authenticateToken, uploadEducacionContinuaImagen, createCurso);
router.put('/cursos/reorder', authenticateToken, updateCursoOrder);
router.put('/cursos/:id', authenticateToken, uploadEducacionContinuaImagen, updateCurso);
router.delete('/cursos/:id', authenticateToken, deleteCurso);
router.patch('/cursos/:id/status', authenticateToken, toggleCursoStatus);

// Videos Admin
router.get('/videos', authenticateToken, getVideos);
router.post('/videos', authenticateToken, createVideo);
router.put('/videos/:id', authenticateToken, updateVideo);
router.delete('/videos/:id', authenticateToken, deleteVideo);
router.patch('/videos/:id/status', authenticateToken, toggleVideoStatus);

// Categorias Documentos Admin
router.get('/categorias', authenticateToken, obtenerCategoriasAdmin);
router.post('/categorias', authenticateToken, crearCategoria);
router.put('/categorias/:id', authenticateToken, actualizarCategoria);
router.delete('/categorias/:id', authenticateToken, eliminarCategoria);

// Documentos Admin
router.get('/documentos', authenticateToken, obtenerDocumentosAdmin);
router.post('/documentos', authenticateToken, uploadEducacionContinuaDocumento.single('archivo'), validateUploadedEducacionContinuaDocumento, crearDocumento);
router.put('/documentos/:id', authenticateToken, uploadEducacionContinuaDocumento.single('archivo'), validateUploadedEducacionContinuaDocumentoOptional, actualizarDocumento);
router.delete('/documentos/:id', authenticateToken, eliminarDocumento);

// Banners (Página Principal) Admin
router.get('/banners', authenticateToken, getBanners);
router.post('/banners', authenticateToken, uploadEducacionContinuaImagen, createBanner);
router.put('/banners/reorder', authenticateToken, updateBannerOrder);
router.put('/banners/:id', authenticateToken, uploadEducacionContinuaImagen, updateBanner);
router.delete('/banners/:id', authenticateToken, deleteBanner);
router.patch('/banners/:id/status', authenticateToken, toggleBannerStatus);

export default router;
