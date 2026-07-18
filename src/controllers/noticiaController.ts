import { Request, Response } from 'express';
import Noticia from '../models/Noticia';
import { NoticiaConfig } from '../models/NoticiaConfig';
import fs from 'fs';
import path from 'path';

// Helper para borrar imagen física de noticias
const deleteNoticiaFile = (filename: string) => {
  try {
    const filePath = path.join(__dirname, '../../uploads/noticias', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error('Error al eliminar archivo físico de noticia:', e);
  }
};

export const getNoticias = async (req: Request, res: Response) => {
  try {
    const noticias = await Noticia.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']],
    });
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

export const createNoticia = async (req: Request, res: Response) => {
  try {
    const { titulo, enlace } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó imagen' });
    }

    const noticia = await Noticia.create({
      titulo,
      imagen: file.filename,
      enlace: enlace || null,
      orden: 0,
      activo: true,
    });

    res.status(201).json(noticia);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
};

export const updateNoticia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, orden, activo, enlace } = req.body;
    const file = req.file;

    const noticia = await Noticia.findByPk(id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    const updateData: any = { titulo, orden, activo, enlace: enlace !== undefined ? (enlace || null) : noticia.enlace };
    if (file) {
      // Eliminar imagen anterior si existe
      if (noticia.imagen) deleteNoticiaFile(noticia.imagen);
      updateData.imagen = file.filename;
    }

    await noticia.update(updateData);
    res.json(noticia);
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
};

export const deleteNoticia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);
    
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    // Eliminar imagen física si existe
    if (noticia.imagen) deleteNoticiaFile(noticia.imagen);

    await noticia.destroy();
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
};

// GET - Obtener configuración de cabeceras de noticias
export const getNoticiaConfig = async (req: Request, res: Response) => {
  try {
    let config = await NoticiaConfig.findOne();
    if (!config) {
      config = await NoticiaConfig.create({});
    }
    res.json(config);
  } catch (error) {
    console.error('Error al obtener config de noticias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT - Actualizar configuración de cabeceras de noticias
export const updateNoticiaConfig = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion } = req.body;
    let config = await NoticiaConfig.findOne();
    if (!config) {
      config = await NoticiaConfig.create({});
    }
    config.titulo = titulo ?? config.titulo;
    config.descripcion = descripcion ?? config.descripcion;
    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Error al actualizar config de noticias:', error);
    res.status(500).json({ error: 'Error al actualizar config de noticias' });
  }
};
