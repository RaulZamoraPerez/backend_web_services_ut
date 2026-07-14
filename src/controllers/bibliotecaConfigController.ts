import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import BibliotecaConfig from '../models/BibliotecaConfig';

export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    let config = await BibliotecaConfig.findOne();
    if (!config) {
      config = await BibliotecaConfig.create({
        titulo: 'Biblioteca Digital',
        descripcion: 'Acceso directo a las mejores fuentes de información académica, científica y cultural para fortalecer tu investigación.'
      });
    }
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching Biblioteca config', details: error.message });
  }
};

export const updateConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      titulo, 
      descripcion, 
      catalog_title, 
      catalog_description, 
      catalog_url, 
      catalog_pdf_path, 
      catalog_qr_path, 
      catalog_active 
    } = req.body;
    let config = await BibliotecaConfig.findOne();
    
    // Default initial attributes
    const defaults = {
      titulo: titulo || 'Biblioteca Digital',
      descripcion: descripcion || 'Acceso directo a las mejores fuentes de información académica, científica y cultural para fortalecer tu investigación.'
    };

    if (!config) {
      config = await BibliotecaConfig.create(defaults);
    }

    const updateData: any = {
      titulo,
      descripcion,
      catalog_title,
      catalog_description,
      catalog_url
    };

    if (catalog_active !== undefined) {
      updateData.catalog_active = catalog_active === 'true' || catalog_active === true;
    }

    if (catalog_pdf_path !== undefined) {
      updateData.catalog_pdf_path = catalog_pdf_path === '' || catalog_pdf_path === 'null' ? null : catalog_pdf_path;
    }

    if (catalog_qr_path !== undefined) {
      updateData.catalog_qr_path = catalog_qr_path === '' || catalog_qr_path === 'null' ? null : catalog_qr_path;
    }

    // Handle file uploads
    const files = req.files as any;
    const uploadDir = path.join(__dirname, '../../uploads/biblioteca');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (files) {
      if (files.catalog_pdf) {
        const pdfFile = files.catalog_pdf as fileUpload.UploadedFile;
        const pdfFileName = `${Date.now()}_${pdfFile.name.replace(/\s+/g, '_')}`;
        const pdfFilePath = path.join(uploadDir, pdfFileName);
        await pdfFile.mv(pdfFilePath);
        updateData.catalog_pdf_path = `/uploads/biblioteca/${pdfFileName}`;
      }

      if (files.catalog_qr) {
        const qrFile = files.catalog_qr as fileUpload.UploadedFile;
        const qrFileName = `${Date.now()}_${qrFile.name.replace(/\s+/g, '_')}`;
        const qrFilePath = path.join(uploadDir, qrFileName);
        await qrFile.mv(qrFilePath);
        updateData.catalog_qr_path = `/uploads/biblioteca/${qrFileName}`;
      }
    }

    await config.update(updateData);
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: 'Error updating Biblioteca config', details: error.message });
  }
};
