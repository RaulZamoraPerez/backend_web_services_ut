import { NextFunction, Request, Response } from "express";
import PortalDocente from "../models/PortalDocente";
import path from 'path';
import fs from 'fs';

// ============================================
// CONTROLADOR PARA PORTAL docente
// ============================================

// GET /api/portal-docente
// Obtener la configuración del portal docente
export const getPortalConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener la configuración activa
    let config = await PortalDocente.findOne({
      where: { activo: true }
    });

    // Si no existe, devolver configuración por defecto
    if (!config) {
      return res.json({
        titulo: 'MI ESCUELA',
        subtitulo: 'UNIVERSIDAD TECNOLÓGICA DE TECAMACHALCO',
        badgeTexto: 'Información importante',
        parrafo1: 'En la Universidad Tecnológica de Tecamachalco se cuenta con un sistema de control escolar que es acorde al modelo educativo de la institución y puede ser consultado por toda la comunidad universitaria.',
        parrafo2: 'El sistema de Control Escolar está disponible los 365 días del año, durante las 24 horas del día y está administrado por el departamento de Servicios Escolares.',
        parrafo3: 'Para ingresar al sistema de control escolar deberás tener tu usuario y contraseña y acceder en el siguiente enlace:',
        imagenUrl: '',
        enlaceBoton: 'http://187.217.125.214/uttecam/acceso.asp',
        textoBoton: 'Acceder al Sistema',
        activo: true
      });
    }

    res.json(config);
  } catch (error) {
    next(error);
  }
};

// PUT /api/portal-docente
// Actualizar la configuración del portal docente
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
    let config = await PortalDocente.findOne({
      where: { activo: true }
    });

    if (!config) {
      // Crear nueva configuración
      config = await PortalDocente.create({
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
        imagenUrl: imagenUrl || config.imagenUrl,
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

// POST /api/portal-docente/upload-image
// Subir imagen para el portal docente
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

// DELETE /api/portal-docente/image/:filename
// Eliminar imagen del portal docente
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
