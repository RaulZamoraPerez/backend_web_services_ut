import { Request, Response } from 'express';
import Anuncio from '../models/Anuncio';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

// Helper para borrar imagen física de anuncios
const deleteAnuncioFile = (filename: string) => {
  try {
    const filePath = path.join(__dirname, '../../uploads/anuncios', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error('Error al eliminar archivo físico de anuncio:', e);
  }
};

export const getAnuncios = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const anuncios = await Anuncio.findAll({
      where: { 
        activo: true,
        fecha_inicio: {
          [Op.lte]: now
        },
        fecha_fin: {
          [Op.gte]: now
        }
      },
      order: [['fecha_creacion', 'DESC']],
    });
    res.json(anuncios);
  } catch (error) {
    console.error('Error al obtener anuncios:', error);
    res.status(500).json({ error: 'Error al obtener anuncios' });
  }
};

export const getAnuncioActivo = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const anuncio = await Anuncio.findOne({
      where: { 
        activo: true,
        fecha_inicio: {
          [Op.lte]: now
        },
        fecha_fin: {
          [Op.gte]: now
        }
      },
      order: [['fecha_creacion', 'DESC']],
    });
    
    if (!anuncio) {
      return res.status(404).json({ message: 'No hay anuncios activos' });
    }
    
    res.json(anuncio);
  } catch (error) {
    console.error('Error al obtener anuncio activo:', error);
    res.status(500).json({ error: 'Error al obtener anuncio activo' });
  }
};

export const createAnuncio = async (req: Request, res: Response) => {
  try {
    const { titulo, fecha_inicio, fecha_fin, activo } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó imagen' });
    }

    const anuncio = await Anuncio.create({
      titulo,
      imagen: file.filename,
      fecha_inicio,
      fecha_fin,
      activo: activo !== undefined ? activo : true,
    });

    res.status(201).json(anuncio);
  } catch (error) {
    console.error('Error al crear anuncio:', error);
    res.status(500).json({ error: 'Error al crear anuncio' });
  }
};

export const updateAnuncio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, fecha_inicio, fecha_fin, activo } = req.body;
    const file = req.file;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    const updateData: any = { titulo, fecha_inicio, fecha_fin, activo };
    if (file) {
      // Eliminar imagen anterior si existe
      if (anuncio.imagen) deleteAnuncioFile(anuncio.imagen);
      updateData.imagen = file.filename;
    }

    await anuncio.update(updateData);
    res.json(anuncio);
  } catch (error) {
    console.error('Error al actualizar anuncio:', error);
    res.status(500).json({ error: 'Error al actualizar anuncio' });
  }
};

export const deleteAnuncio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const anuncio = await Anuncio.findByPk(id);
    
    if (!anuncio) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    // Eliminar imagen física si existe
    if (anuncio.imagen) deleteAnuncioFile(anuncio.imagen);

    await anuncio.destroy();
    res.json({ message: 'Anuncio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    res.status(500).json({ error: 'Error al eliminar anuncio' });
  }
};
