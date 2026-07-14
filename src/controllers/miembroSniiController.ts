import { Request, Response } from 'express';
import MiembroSNII from '../models/MiembroSNII';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getAllMiembros = async (req: Request, res: Response) => {
  try {
    const miembros = await MiembroSNII.findAll({
      where: { activo: true },
      order: [['orden', 'ASC'], ['fecha_creacion', 'DESC']]
    });
    res.json(miembros);
  } catch (error) {
    console.error('Error al obtener miembros SNII:', error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
};

export const createMiembro = async (req: Request, res: Response) => {
  try {
    const { titulo, orden, tipo } = req.body;
    const savedPdfPath = (req as any).savedPdfPath;

    if (!savedPdfPath) {
      return res.status(400).json({ message: 'El archivo PDF es requerido' });
    }

    const nuevoMiembro = await MiembroSNII.create({
      titulo,
      pdf: savedPdfPath,
      orden: orden ? parseInt(orden) : 0,
      activo: true,
      tipo: tipo || 'General'
    });

    res.status(201).json(nuevoMiembro);
  } catch (error) {
    console.error('Error al crear miembro SNII:', error);
    // Si hubo error y se subió archivo, intentar borrarlo
    if ((req as any).savedPdfPath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedPdfPath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al crear el registro' });
  }
};

export const updateMiembro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, orden, activo, tipo } = req.body;
    const savedPdfPath = (req as any).savedPdfPath;

    const miembro = await MiembroSNII.findByPk(id);

    if (!miembro) {
      if (savedPdfPath) {
        const fullPath = path.join(__dirname, '../../uploads', savedPdfPath);
        deleteFile(fullPath);
      }
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Si hay nuevo PDF, borrar el anterior
    if (savedPdfPath && miembro.pdf) {
      const oldPath = path.join(__dirname, '../../uploads', miembro.pdf);
      deleteFile(oldPath);
    }

    await miembro.update({
      titulo: titulo || miembro.titulo,
      orden: orden !== undefined ? parseInt(orden) : miembro.orden,
      activo: activo !== undefined ? activo === 'true' || activo === true : miembro.activo,
      pdf: savedPdfPath || miembro.pdf,
      tipo: tipo || miembro.tipo
    });

    res.json(miembro);
  } catch (error) {
    console.error('Error al actualizar miembro SNII:', error);
    if ((req as any).savedPdfPath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedPdfPath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al actualizar el registro' });
  }
};

export const deleteMiembro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const miembro = await MiembroSNII.findByPk(id);

    if (!miembro) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Borrar archivo físico
    if (miembro.pdf) {
      const fullPath = path.join(__dirname, '../../uploads', miembro.pdf);
      deleteFile(fullPath);
    }

    await miembro.destroy();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar miembro SNII:', error);
    res.status(500).json({ message: 'Error al eliminar el registro' });
  }
};
