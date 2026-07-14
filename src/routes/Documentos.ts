import { Router } from "express";
import {
  // Controladores de Áreas
  obtenerAreas,
  obtenerAreaPorId,
  crearArea,
  actualizarArea,
  eliminarArea,
  // Controladores de Categorías
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  // Controladores de Archivos
  obtenerArchivos,
  obtenerArchivoPorId,
  obtenerArchivosPorArea,
  crearArchivo,
  subirArchivo,
  actualizarArchivo,
  eliminarArchivo,
  // Estadísticas
  obtenerEstadisticas
} from "../controllers/DocumentsController";
import { uploadDocumentos, validateUploadedDocument, checkCategoryArea } from "../middleware/uploadMiddleware";

const router = Router();

// ============================================
// RUTAS PARA ÁREAS
// ============================================
router.get("/areas", obtenerAreas);
router.get("/areas/:id", obtenerAreaPorId);
router.post("/areas", crearArea);
router.put("/areas/:id", actualizarArea);
router.delete("/areas/:id", eliminarArea);

// ============================================
// RUTAS PARA CATEGORÍAS
// ============================================
router.get("/categorias", obtenerCategorias);
router.get("/categorias/:id", obtenerCategoriaPorId);
router.post("/categorias", crearCategoria);
router.put("/categorias/:id", actualizarCategoria);
router.delete("/categorias/:id", eliminarCategoria);

// ============================================
// RUTAS PARA ARCHIVOS
// ============================================
router.get("/archivos", obtenerArchivos);
router.get("/archivos/:id", obtenerArchivoPorId);
router.get("/archivos/area/:areaId", obtenerArchivosPorArea);
router.post("/archivos", crearArchivo);
router.post("/archivos/upload", checkCategoryArea, uploadDocumentos.single('archivo'), validateUploadedDocument, subirArchivo);
router.put("/archivos/:id", actualizarArchivo);
router.delete("/archivos/:id", eliminarArchivo);

// ============================================
// RUTAS PARA ESTADÍSTICAS
// ============================================
router.get("/estadisticas", obtenerEstadisticas);

// RUTAS DE DIAGNÓSTICO
// ============================================
router.get("/check-file/:categoryId/:filename", (req, res) => {
  const { categoryId, filename } = req.params;
  const fs = require('fs');
  const path = require('path');
  
  // Decodificar el filename por si tiene caracteres especiales
  const decodedFilename = decodeURIComponent(filename);
  
  // Construir rutas - ahora todos los archivos están directamente en uploads/documentos
  const filePath = path.join(__dirname, '../../uploads/documentos', decodedFilename);
  const urlPath = `/uploads/documentos/${decodedFilename}`;
  
  // Verificar si existe
  const exists = fs.existsSync(filePath);
  let fileStats = null;
  let error = null;
  
  if (exists) {
    try {
      fileStats = fs.statSync(filePath);
    } catch (err: any) {
      error = err.message;
    }
  }
  
  res.json({
    filename: decodedFilename,
    categoryId, // Mantener para compatibilidad
    filePath: filePath.replace(/\\/g, '/'), // Normalizar para respuesta JSON
    urlPath,
    fullUrl: `${req.protocol}://${req.get('host')}${urlPath}`,
    exists,
    size: fileStats?.size || null,
    modified: fileStats?.mtime || null,
    error,
    serverPath: __dirname
  });
});

export default router;
