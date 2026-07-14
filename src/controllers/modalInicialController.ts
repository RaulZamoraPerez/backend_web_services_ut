import { Request, Response } from 'express';
import ModalInicialConfig from '../models/ModalInicialConfig';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getConfig = async (req: Request, res: Response) => {
  try {
    let config = await ModalInicialConfig.findOne({ where: { id: 1 } });
    if (!config) {
      config = await ModalInicialConfig.create({
        id: 1,
        activo: false,
        imagen: '',
        enlace_pdf: null,
      });
    }
    res.json(config);
  } catch (error) {
    console.error('Error al obtener config modal:', error);
    res.status(500).json({ error: 'Error al obtener la configuración del modal' });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { activo } = req.body;
    let config = await ModalInicialConfig.findOne({ where: { id: 1 } });

    if (!config) {
      config = await ModalInicialConfig.create({
        id: 1,
        activo: activo === 'true' || activo === true,
        imagen: '',
        enlace_pdf: null,
      });
    }

    const updateData: any = { activo: activo === 'true' || activo === true };

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    if (files && files['imagen'] && files['imagen'].length > 0) {
      if (config.imagen && config.imagen.trim() !== '') {
        const oldImagePath = path.join('uploads/noticias', config.imagen);
        deleteFile(oldImagePath);
      }
      updateData.imagen = files['imagen'][0].filename;
    }
    
    if (files && files['pdf'] && files['pdf'].length > 0) {
      if (config.enlace_pdf && config.enlace_pdf.trim() !== '') {
        const oldPdfPath = path.join('uploads/noticias', config.enlace_pdf);
        deleteFile(oldPdfPath);
      }
      updateData.enlace_pdf = files['pdf'][0].filename;
    }

    await config.update(updateData);
    res.json(config);
  } catch (error) {
    console.error('Error al actualizar config modal:', error);
    res.status(500).json({ error: 'Error al actualizar la configuración del modal' });
  }
};
