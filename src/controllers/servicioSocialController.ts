import { Request, Response, NextFunction } from 'express';
import ServicioSocialDocumento from '../models/ServicioSocialDocumento';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documents = await ServicioSocialDocumento.findAll({
      order: [['Fecha_Subida', 'DESC']]
    });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Nombre, Descripcion, Ruta_Documento, Tipo } = req.body;

    if (!Ruta_Documento) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const newDoc = await ServicioSocialDocumento.create({
      Nombre,
      Descripcion,
      Ruta_Documento,
      Tipo
    });

    res.status(201).json(newDoc);
  } catch (error) {
    // Clean up file if DB creation fails
    if (req.body.Ruta_Documento) {
        const filePath = path.join(__dirname, '../../', req.body.Ruta_Documento);
        deleteFile(filePath);
    }
    next(error);
  }
};

export const updateDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Tipo } = req.body;

    const doc = await ServicioSocialDocumento.findByPk(id);
    if (!doc) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await doc.update({ Nombre, Descripcion, Tipo });
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const doc = await ServicioSocialDocumento.findByPk(id);

    if (!doc) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    if (doc.Ruta_Documento) {
      const filePath = path.join(__dirname, '../../', doc.Ruta_Documento);
      deleteFile(filePath);
    }

    await doc.destroy();
    res.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
