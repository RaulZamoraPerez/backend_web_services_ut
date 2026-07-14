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
} from '../controllers/visitasGuiadasController';
import { uploadVisitasGuiadasImagen } from '../middleware/visitasGuiadasUpload';
import { uploadVisitasGuiadasDocumento, validateUploadedVisitasGuiadasDocumento, validateUploadedVisitasGuiadasDocumentoOptional } from '../middleware/visitasGuiadasDocumentoUpload';
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
} from '../controllers/visitasGuiadasDocumentosController';

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
router.post('/cursos', authenticateToken, uploadVisitasGuiadasImagen, createCurso);
router.put('/cursos/reorder', authenticateToken, updateCursoOrder);
router.put('/cursos/:id', authenticateToken, uploadVisitasGuiadasImagen, updateCurso);
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
router.post('/documentos', authenticateToken, uploadVisitasGuiadasDocumento.single('archivo'), validateUploadedVisitasGuiadasDocumento, crearDocumento);
router.put('/documentos/:id', authenticateToken, uploadVisitasGuiadasDocumento.single('archivo'), validateUploadedVisitasGuiadasDocumentoOptional, actualizarDocumento);
router.delete('/documentos/:id', authenticateToken, eliminarDocumento);

// Banners (Página Principal) Admin
router.get('/banners', authenticateToken, getBanners);
router.post('/banners', authenticateToken, uploadVisitasGuiadasImagen, createBanner);
router.put('/banners/reorder', authenticateToken, updateBannerOrder);
router.put('/banners/:id', authenticateToken, uploadVisitasGuiadasImagen, updateBanner);
router.delete('/banners/:id', authenticateToken, deleteBanner);
router.patch('/banners/:id/status', authenticateToken, toggleBannerStatus);

export default router;
