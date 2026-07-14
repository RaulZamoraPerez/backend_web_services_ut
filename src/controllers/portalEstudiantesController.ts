import { NextFunction, Request, Response } from "express";
import PortalEstudiantes from "../models/PortalEstudiantes";
import path from 'path';
import fs from 'fs';

// ============================================
// CONTROLADOR PARA PORTAL ESTUDIANTES
// ============================================

// GET /api/portal-estudiantes
// Obtener la configuración del portal estudiantes
export const getPortalConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener la configuración activa
    let config = await PortalEstudiantes.findOne({
      where: { activo: true }
    });

    // Si no existe, devolver configuración vacía
    if (!config) {
      return res.json({
        titulo: '',
        subtitulo: '',
        badgeTexto: '',
        parrafo1: '',
        parrafo2: '',
        parrafo3: '',
        imagenUrl: '',
        enlaceBoton: '',
        textoBoton: '',
        activo: false
      });
    }

    res.json(config);
  } catch (error) {
    next(error);
  }
};

// PUT /api/portal-estudiantes
// Actualizar la configuración del portal estudiantes
export const updatePortalConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      titulo,
      subtitulo,
      badgeTexto,
      parrafo1,
      parrafo2,
      parrafo3,
      imagenUrl,
      enlaceBoton,
      textoBoton
    } = req.body;

    // Validar campos requeridos
    if (!titulo || !subtitulo || !badgeTexto || !parrafo1 || !parrafo2 || !parrafo3 || !enlaceBoton || !textoBoton) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: "Todos los campos son requeridos"
      });
    }

    // Buscar configuración existente
    let config = await PortalEstudiantes.findOne({
      where: { activo: true }
    });

    if (!config) {
      // Crear nueva configuración
      config = await PortalEstudiantes.create({
        titulo,
        subtitulo,
        badgeTexto,
        parrafo1,
        parrafo2,
        parrafo3,
        imagenUrl: imagenUrl || '',
        enlaceBoton,
        textoBoton,
        activo: true
      });
    } else {
      // Actualizar configuración existente
      await config.update({
        titulo,
        subtitulo,
        badgeTexto,
        parrafo1,
        parrafo2,
        parrafo3,
        imagenUrl: imagenUrl !== undefined ? imagenUrl : config.imagenUrl,
        enlaceBoton,
        textoBoton
      });
    }

    res.json({
      message: "Configuración actualizada exitosamente",
      config: config.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/portal-estudiantes/upload-image
// Subir imagen para el portal estudiantes
export const uploadPortalImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No se proporcionó ningún archivo"
      });
    }

    // El archivo ya fue guardado por multer en uploads/nosotros
    // Devolver solo el nombre del archivo
    const imagePath = req.file.filename;

    res.json({
      message: "Imagen subida exitosamente",
      imagenUrl: imagePath
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/portal-estudiantes/image/:filename
// Eliminar imagen del portal estudiantes
export const deletePortalImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    const uploadsDir = path.join(__dirname, '../../uploads/nosotros');
    const filePath = path.join(uploadsDir, filename);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "Archivo no encontrado"
      });
    }

    // Eliminar el archivo
    fs.unlinkSync(filePath);

    res.json({
      message: "Imagen eliminada exitosamente"
    });
  } catch (error) {
    next(error);
  }
};
