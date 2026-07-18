import { Request, Response } from 'express';
import HeroSlide from '../models/HeroSlide';

export const getHeroSlides = async (req: Request, res: Response) => {
  try {
    // Allow including inactive slides using a query param: ?includeInactive=true
    const includeInactive = req.query.includeInactive === 'true';
    const whereClause: any = {};
    if (!includeInactive) whereClause.activo = true;

    const slides = await HeroSlide.findAll({
      where: whereClause,
      order: [['orden', 'ASC']],
    });
    res.json(slides);
  } catch (error) {
    console.error('Error al obtener slides del hero:', error);
    res.status(500).json({ error: 'Error al obtener slides del hero' });
  }
};

export const createHeroSlide = async (req: Request, res: Response) => {
  try {
    const { titulo, tipo, color_fondo } = req.body;
    const archivo = (req as any).savedHeroFile;
    const archivo_movil = (req as any).savedHeroMobileFile;

    if (!archivo) {
      return res.status(400).json({ error: 'No se proporcionó archivo principal' });
    }

    const slide = await HeroSlide.create({
      titulo,
      tipo,
      archivo,
      archivo_movil: archivo_movil || null,
      orden: 0,
      activo: true,
      color_fondo: color_fondo || '#ffffff',
    });

    res.status(201).json(slide);
  } catch (error) {
    console.error('Error al crear slide del hero:', error);
    res.status(500).json({ error: 'Error al crear slide del hero' });
  }
};

export const updateHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, tipo, orden, activo, color_fondo, remove_archivo_movil } = req.body;
    const archivo = (req as any).savedHeroFile;
    const archivo_movil = (req as any).savedHeroMobileFile;

    const slide = await HeroSlide.findByPk(id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }

    const fs = require('fs');
    const path = require('path');

    const updateData: any = { titulo, tipo, orden, activo };
    if (color_fondo !== undefined) updateData.color_fondo = color_fondo;
    if (archivo) {
      // Eliminar archivo principal anterior
      if (slide.archivo) {
        const oldPath = path.join(__dirname, '../../uploads/hero', slide.archivo);
        try { if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } catch (e) { console.warn('No se pudo eliminar archivo anterior:', e); }
      }
      updateData.archivo = archivo;
    }
    if (archivo_movil) {
      // Eliminar archivo móvil anterior
      if (slide.archivo_movil) {
        const oldMobilePath = path.join(__dirname, '../../uploads/hero', slide.archivo_movil);
        try { if (fs.existsSync(oldMobilePath)) fs.unlinkSync(oldMobilePath); } catch (e) { console.warn('No se pudo eliminar archivo móvil anterior:', e); }
      }
      updateData.archivo_movil = archivo_movil;
    } else if (remove_archivo_movil === 'true') {
      // Eliminar archivo móvil físico si se solicita su remoción
      if (slide.archivo_movil) {
        const oldMobilePath = path.join(__dirname, '../../uploads/hero', slide.archivo_movil);
        try { if (fs.existsSync(oldMobilePath)) fs.unlinkSync(oldMobilePath); } catch (e) { console.warn('No se pudo eliminar archivo móvil:', e); }
      }
      updateData.archivo_movil = null;
    }

    await slide.update(updateData);
    res.json(slide);
  } catch (error) {
    console.error('Error al actualizar slide del hero:', error);
    res.status(500).json({ error: 'Error al actualizar slide del hero' });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);
    
    if (!slide) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }

    const fs = require('fs');
    const path = require('path');
    
    if (slide.archivo) {
      const filePath = path.join(__dirname, '../../uploads/hero', slide.archivo);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (fileErr) {
        console.warn(`No se pudo eliminar el archivo físico: ${filePath}`, fileErr);
      }
    }
    
    if (slide.archivo_movil) {
      const mobileFilePath = path.join(__dirname, '../../uploads/hero', slide.archivo_movil);
      try {
        if (fs.existsSync(mobileFilePath)) fs.unlinkSync(mobileFilePath);
      } catch (fileErr) {
        console.warn(`No se pudo eliminar el archivo móvil físico: ${mobileFilePath}`, fileErr);
      }
    }

    await slide.destroy();
    res.json({ message: 'Slide eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar slide del hero:', error);
    res.status(500).json({ error: 'Error al eliminar slide del hero' });
  }
};
