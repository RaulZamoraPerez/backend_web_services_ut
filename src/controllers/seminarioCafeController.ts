import { Request, Response } from 'express';
import SeminarioCafeRecurso from '../models/SeminarioCafeRecurso';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await SeminarioCafeRecurso.findAll({
      where: { is_active: true },
      order: [['fecha_subida', 'DESC']]
    });
    res.json(resources);
  } catch (error) {
    console.error('Error al obtener recursos de Seminario Café:', error);
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, carpeta } = req.body;
    const savedFilePath = (req as any).savedFilePath;
    const fileType = (req as any).fileType;

    if (!savedFilePath) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const newResource = await SeminarioCafeRecurso.create({
      titulo: titulo || 'Sin título',
      descripcion,
      url: `/uploads/${savedFilePath}`,
      tipo: fileType || 'pdf',
      carpeta: carpeta || 'General',
      fecha_subida: new Date(),
      is_active: true
    });

    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error al crear recurso de Seminario Café:', error);
    res.status(500).json({ message: 'Error al crear recurso' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await SeminarioCafeRecurso.findByPk(id);

    if (!resource) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    // Eliminar archivo físico
    // La URL es algo como /uploads/seminario-cafe/documentos/archivo.pdf
    // Necesitamos la ruta absoluta
    const relativePath = resource.url.replace('/uploads/', '');
    const absolutePath = path.join(__dirname, '../../uploads', relativePath);
    
    deleteFile(absolutePath);

    // Eliminar registro (o desactivar)
    // Usaremos destroy para eliminar completamente
    await resource.destroy();

    res.json({ message: 'Recurso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar recurso de Seminario Café:', error);
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, carpeta } = req.body;
    const savedFilePath = (req as any).savedFilePath;

    const resource = await SeminarioCafeRecurso.findByPk(id);

    if (!resource) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    // Si se subió un nuevo archivo, eliminar el anterior
    if (savedFilePath && resource.url) {
      const oldRelativePath = resource.url.replace('/uploads/', '');
      const oldAbsolutePath = path.join(__dirname, '../../uploads', oldRelativePath);
      deleteFile(oldAbsolutePath);
    }

    await resource.update({
      titulo: titulo || resource.titulo,
      descripcion: descripcion || resource.descripcion,
      carpeta: carpeta || resource.carpeta,
      ...(savedFilePath && { url: `/uploads/${savedFilePath}` })
    });

    res.json(resource);
  } catch (error) {
    console.error('Error al actualizar recurso de Seminario Café:', error);
    res.status(500).json({ message: 'Error al actualizar recurso' });
  }
};

