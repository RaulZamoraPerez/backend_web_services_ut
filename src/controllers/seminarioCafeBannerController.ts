import { Request, Response } from 'express';
import SeminarioCafeBanner from '../models/SeminarioCafeBanner';
import path from 'path';
import fs from 'fs';

const deleteLocalFile = (filename: string) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error al eliminar archivo local:', error);
  }
};

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await SeminarioCafeBanner.findAll({ order: [['id', 'DESC']] });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener banners' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No se proporcionó la imagen' });
    
    const imagenPath = `${file.filename}`;
    const banner = await SeminarioCafeBanner.create({ titulo, descripcion, imagen: imagenPath, activo: true });
    res.status(201).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear banner' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, activo } = req.body;
    const file = req.file;

    const banner = await SeminarioCafeBanner.findByPk(id);
    if (!banner) return res.status(404).json({ error: 'Banner no encontrado' });

    const updateData: any = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (activo !== undefined) updateData.activo = activo === 'true' || activo === true;

    if (file) {
      if (banner.imagen) deleteLocalFile(banner.imagen);
      updateData.imagen = `${file.filename}`;
    }

    await banner.update(updateData);
    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar banner' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await SeminarioCafeBanner.findByPk(id);
    
    if (!banner) return res.status(404).json({ error: 'Banner no encontrado' });
    if (banner.imagen) deleteLocalFile(banner.imagen);

    await banner.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar banner' });
  }
};
