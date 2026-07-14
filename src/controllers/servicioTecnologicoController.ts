import { Request, Response } from 'express';
import ServicioTecnologico from '../models/ServicioTecnologico';
import path from 'path';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getServiciosPublic = async (req: Request, res: Response) => {
  try {
    const servicios = await ServicioTecnologico.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']],
    });
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios tecnológicos:', error);
    res.status(500).json({ error: 'Error al obtener servicios tecnológicos' });
  }
};

export const getAllServicios = async (req: Request, res: Response) => {
  try {
    const servicios = await ServicioTecnologico.findAll({
      order: [['orden', 'ASC']],
    });
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener todos los servicios tecnológicos:', error);
    res.status(500).json({ error: 'Error al obtener servicios tecnológicos' });
  }
};

export const getServicioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const servicio = await ServicioTecnologico.findByPk(id);
    
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio tecnológico no encontrado' });
    }

    res.json(servicio);
  } catch (error) {
    console.error('Error al obtener servicio tecnológico:', error);
    res.status(500).json({ error: 'Error al obtener servicio tecnológico' });
  }
};

export const createServicio = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, orden, activo } = req.body;
    const savedImagePath = (req as any).savedImagePath;
    const savedPdfPath = (req as any).savedPdfPath;

    if (!savedImagePath && !savedPdfPath) {
      return res.status(400).json({ error: 'Debe subir al menos una imagen o un PDF' });
    }

    const servicio = await ServicioTecnologico.create({
      titulo,
      descripcion,
      imagen: savedImagePath || null,
      pdf: savedPdfPath || null,
      orden: orden ? parseInt(orden) : 0,
      activo: activo === 'true' || activo === true,
    });

    res.status(201).json(servicio);
  } catch (error) {
    console.error('Error al crear servicio tecnológico:', error);
    res.status(500).json({ error: 'Error al crear servicio tecnológico' });
  }
};

export const updateServicio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, orden, activo } = req.body;
    const savedImagePath = (req as any).savedImagePath;
    const savedPdfPath = (req as any).savedPdfPath;

    const servicio = await ServicioTecnologico.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio tecnológico no encontrado' });
    }

    const updateData: any = { 
      titulo, 
      descripcion, 
      orden: orden ? parseInt(orden) : servicio.orden,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : servicio.activo
    };

    if (savedImagePath) {
      // Eliminar imagen anterior
      if (servicio.imagen) {
        const oldPath = path.join(__dirname, '../../uploads', servicio.imagen);
        deleteFile(oldPath);
      }
      updateData.imagen = savedImagePath;
    }

    if (savedPdfPath) {
      // Eliminar PDF anterior
      if (servicio.pdf) {
        const oldPath = path.join(__dirname, '../../uploads', servicio.pdf);
        deleteFile(oldPath);
      }
      updateData.pdf = savedPdfPath;
    }

    await servicio.update(updateData);
    res.json(servicio);
  } catch (error) {
    console.error('Error al actualizar servicio tecnológico:', error);
    res.status(500).json({ error: 'Error al actualizar servicio tecnológico' });
  }
};

export const deleteServicio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const servicio = await ServicioTecnologico.findByPk(id);
    
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio tecnológico no encontrado' });
    }

    // Eliminar archivos asociados
    if (servicio.imagen) {
      const imagePath = path.join(__dirname, '../../uploads', servicio.imagen);
      deleteFile(imagePath);
    }

    if (servicio.pdf) {
      const pdfPath = path.join(__dirname, '../../uploads', servicio.pdf);
      deleteFile(pdfPath);
    }

    await servicio.destroy();
    res.json({ message: 'Servicio tecnológico eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar servicio tecnológico:', error);
    res.status(500).json({ error: 'Error al eliminar servicio tecnológico' });
  }
};
