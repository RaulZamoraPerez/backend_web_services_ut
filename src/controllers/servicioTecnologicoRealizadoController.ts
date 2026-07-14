import { Request, Response } from 'express';
import ServicioTecnologicoRealizado from '../models/ServicioTecnologicoRealizado';
import path from 'path';
import fs from 'fs';

export const getServiciosRealizadosPublic = async (req: Request, res: Response) => {
  try {
    const servicios = await ServicioTecnologicoRealizado.findAll({
      where: { activo: true },
      order: [['orden', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios tecnológicos realizados:', error);
    res.status(500).json({ error: 'Error al obtener servicios tecnológicos realizados' });
  }
};

export const getAllServiciosRealizados = async (req: Request, res: Response) => {
  try {
    const servicios = await ServicioTecnologicoRealizado.findAll({
      order: [['orden', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener todos los servicios tecnológicos realizados:', error);
    res.status(500).json({ error: 'Error al obtener servicios tecnológicos realizados' });
  }
};

export const getServicioRealizadoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const servicio = await ServicioTecnologicoRealizado.findByPk(id);
    
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio tecnológico realizado no encontrado' });
    }

    res.json(servicio);
  } catch (error) {
    console.error('Error al obtener servicio tecnológico realizado:', error);
    res.status(500).json({ error: 'Error al obtener servicio tecnológico realizado' });
  }
};

export const createServicioRealizado = async (req: Request, res: Response) => {
  try {
    const { titulo, orden, activo, fecha_realizacion } = req.body;
    const savedPdfPath = (req as any).savedPdfPath;

    if (!savedPdfPath) {
      return res.status(400).json({ error: 'El archivo PDF es requerido' });
    }

    const nuevoServicio = await ServicioTecnologicoRealizado.create({
      titulo,
      archivo: savedPdfPath,
      orden: orden ? parseInt(orden) : 0,
      activo: activo === 'true' || activo === true,
      fecha_realizacion: fecha_realizacion || null
    });

    res.status(201).json(nuevoServicio);
  } catch (error) {
    console.error('Error al crear servicio tecnológico realizado:', error);
    // Si hubo error, intentar borrar el archivo subido
    if ((req as any).savedPdfPath) {
      const filePath = path.join(__dirname, '../../uploads', (req as any).savedPdfPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ error: 'Error al crear servicio tecnológico realizado' });
  }
};

export const updateServicioRealizado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, orden, activo, fecha_realizacion } = req.body;
    const savedPdfPath = (req as any).savedPdfPath;

    const servicio = await ServicioTecnologicoRealizado.findByPk(id);

    if (!servicio) {
      // Si se subió un archivo pero no existe el registro, borrar el archivo
      if (savedPdfPath) {
        const filePath = path.join(__dirname, '../../uploads', savedPdfPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ error: 'Servicio tecnológico realizado no encontrado' });
    }

    // Si hay nuevo archivo, borrar el anterior
    if (savedPdfPath && servicio.archivo) {
      const oldFilePath = path.join(__dirname, '../../uploads', servicio.archivo);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await servicio.update({
      titulo: titulo || servicio.titulo,
      archivo: savedPdfPath || servicio.archivo,
      orden: orden !== undefined ? parseInt(orden) : servicio.orden,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : servicio.activo,
      fecha_realizacion: fecha_realizacion || servicio.fecha_realizacion
    });

    res.json(servicio);
  } catch (error) {
    console.error('Error al actualizar servicio tecnológico realizado:', error);
    res.status(500).json({ error: 'Error al actualizar servicio tecnológico realizado' });
  }
};

export const deleteServicioRealizado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const servicio = await ServicioTecnologicoRealizado.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio tecnológico realizado no encontrado' });
    }

    // Borrar archivo físico
    if (servicio.archivo) {
      const filePath = path.join(__dirname, '../../uploads', servicio.archivo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await servicio.destroy();
    res.json({ message: 'Servicio tecnológico realizado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio tecnológico realizado:', error);
    res.status(500).json({ error: 'Error al eliminar servicio tecnológico realizado' });
  }
};
