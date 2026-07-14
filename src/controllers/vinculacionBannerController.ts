import { Request, Response } from 'express';
import VinculacionBannerDocumento from '../models/VinculacionBannerDocumento';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getAllDocumentos = async (req: Request, res: Response) => {
  try {
    const documentos = await VinculacionBannerDocumento.findAll({
      where: { activo: true },
      order: [['orden', 'ASC'], ['fecha_creacion', 'DESC']]
    });
    res.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos de vinculación banner:', error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
};

export const createDocumento = async (req: Request, res: Response) => {
  try {
    const { titulo, orden } = req.body;
    const savedImagePath = (req as any).savedImagePath;

    if (!savedImagePath) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    const nuevoDocumento = await VinculacionBannerDocumento.create({
      titulo,
      imagen: savedImagePath,
      orden: orden ? parseInt(orden) : 0,
      activo: true
    });

    res.status(201).json(nuevoDocumento);
  } catch (error) {
    console.error('Error al crear documento de vinculación banner:', error);
    if ((req as any).savedImagePath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedImagePath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al crear el registro' });
  }
};

export const updateDocumento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, orden, activo } = req.body;
    const savedImagePath = (req as any).savedImagePath;

    const documento = await VinculacionBannerDocumento.findByPk(id);

    if (!documento) {
      if (savedImagePath) {
        const fullPath = path.join(__dirname, '../../uploads', savedImagePath);
        deleteFile(fullPath);
      }
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (savedImagePath && documento.imagen) {
      const oldPath = path.join(__dirname, '../../uploads', documento.imagen);
      deleteFile(oldPath);
    }

    await documento.update({
      titulo: titulo || documento.titulo,
      orden: orden !== undefined ? parseInt(orden) : documento.orden,
      activo: activo !== undefined ? activo === 'true' || activo === true : documento.activo,
      imagen: savedImagePath || documento.imagen
    });

    res.json(documento);
  } catch (error) {
    console.error('Error al actualizar documento de vinculación banner:', error);
    if ((req as any).savedImagePath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedImagePath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al actualizar el registro' });
  }
};

export const deleteDocumento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const documento = await VinculacionBannerDocumento.findByPk(id);

    if (!documento) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (documento.imagen) {
      const fullPath = path.join(__dirname, '../../uploads', documento.imagen);
      deleteFile(fullPath);
    }

    await documento.destroy();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento de vinculación banner:', error);
    res.status(500).json({ message: 'Error al eliminar el registro' });
  }
};
