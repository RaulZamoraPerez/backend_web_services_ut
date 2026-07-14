import { Request, Response } from 'express';
import ExtensionSection from '../models/ExtensionSection';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';
import ExtensionItem from '../models/ExtensionItem';
import ExtensionDocument from '../models/ExtensionDocument';
import logger from '../helpers/logger';

// --- SECTIONS & ITEMS ---

export const getSection = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    if (!slug || slug.trim().length === 0) {
      return res.status(400).json({ message: 'El slug es requerido' });
    }
    
    const section = await ExtensionSection.findOne({ where: { slug } });

    if (!section) {
      logger.warn('Sección no encontrada', { slug });
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    // Query items separately to avoid association issues
    const items = await ExtensionItem.findAll({ where: { section_id: section.id } });

    const sectionData = section.toJSON() as any;
    sectionData.items = items.map((item: any) => ({
      ...item.toJSON(),
      description: item.content ?? '',
      is_active: item.is_active !== undefined ? item.is_active : true,
      order_index: item.order_index ?? 0,
    }));

    res.json(sectionData);
  } catch (error: any) {
    logger.dbError('getSection', error, { slug: req.params.slug });
    res.status(500).json({ 
      message: 'Error al obtener la sección',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    const { slug, title, description } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ message: 'slug y title son requeridos' });
    }
    const existing = await ExtensionSection.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({ message: 'Ya existe una sección con ese slug' });
    }
    const section = await ExtensionSection.create({ slug, title, description, is_enabled: true });
    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ message: 'Error al crear la sección' });
  }
};

export const updateSection = async (req: Request, res: Response) => {

  try {
    const { slug } = req.params;
    const { 
      title, 
      introduction,
      description, 
      banner_url, 
      is_enabled,
      schedule,
      location,
      contact_info,
      requirements,
      registration_info
    } = req.body;
    
    if (!slug || slug.trim().length === 0) {
      return res.status(400).json({ message: 'El slug es requerido' });
    }

    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) {
      logger.warn('Sección no encontrada para actualizar', { slug });
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    const updateData: any = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: 'Título inválido' });
      }
      updateData.title = title;
    }
    if (introduction !== undefined) updateData.introduction = introduction;
    if (description !== undefined) updateData.description = description;
    if (banner_url !== undefined) updateData.banner_url = banner_url;
    if (is_enabled !== undefined) updateData.is_enabled = Boolean(is_enabled);
    
    // New fields
    if (schedule !== undefined) updateData.schedule = schedule;
    if (location !== undefined) updateData.location = location;
    if (contact_info !== undefined) updateData.contact_info = contact_info;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (registration_info !== undefined) updateData.registration_info = registration_info;

    await section.update(updateData);
    logger.info('Sección actualizada exitosamente', { slug, updates: Object.keys(updateData) });
    res.json(section);
  } catch (error: any) {
    logger.dbError('updateSection', error, { slug: req.params.slug });
    res.status(500).json({ 
      message: 'Error al actualizar la sección',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/extension/sections/:slug/upload-image
export const uploadSectionBanner = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) return res.status(404).json({ message: 'Sección no encontrada' });

    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó archivo' });
    }

    // Determine banner_url (relative to /uploads)
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    const resolvedFile = path.resolve(req.file.path);
    let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
    relativePath = `/uploads/${relativePath}`;

    // Clean up previous banner if present and is in uploads
    const prevBanner = section.banner_url;
    if (prevBanner && prevBanner.startsWith('/uploads/')) {
      // Convert banner_url to system path
      const prevPath = path.join(uploadsDir, prevBanner.replace('/uploads/', ''));
      try {
        deleteFile(prevPath);
      } catch (err) {
        // Non-blocking: log & continue
        console.warn('No se pudo eliminar banner anterior:', err);
      }
    }

    await section.update({ banner_url: relativePath });
    res.json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir banner' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    // Accept both 'description' (frontend) and 'content' (legacy)
    const { title, description, content, icon } = req.body;

    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    let image_url = null;
    if (req.file) {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const resolvedFile = path.resolve(req.file.path);
      let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
      image_url = `/uploads/${relativePath}`;
    }

    const item = await ExtensionItem.create({
      section_id: section.id,
      title,
      content: description ?? content,  // store description in content column
      icon,
      image_url: image_url || undefined
    });

    // Return with description field for frontend
    const itemData = item.toJSON() as any;
    res.status(201).json({ ...itemData, description: itemData.content ?? '' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el item' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Accept both 'description' (frontend) and 'content' (legacy)
    const { title, description, content, icon } = req.body;

    const item = await ExtensionItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    let image_url = item.image_url;
    if (req.file) {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const resolvedFile = path.resolve(req.file.path);
      let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
      image_url = `/uploads/${relativePath}`;

      // Clean up previous image if present and is in uploads
      const prevImage = item.image_url;
      if (prevImage && prevImage.startsWith('/uploads/')) {
        const prevPath = path.join(uploadsDir, prevImage.replace('/uploads/', ''));
        try {
          deleteFile(prevPath);
        } catch (err) {
          console.warn('No se pudo eliminar imagen anterior:', err);
        }
      }
    }

    await item.update({ title, content: description ?? content, icon, image_url });
    const itemData = item.toJSON() as any;
    res.json({ ...itemData, description: itemData.content ?? '' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el item' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await ExtensionItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    // Delete associated image if present
    const prevImage = item.image_url;
    if (prevImage && prevImage.startsWith('/uploads/')) {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const prevPath = path.join(uploadsDir, prevImage.replace('/uploads/', ''));
      try {
        deleteFile(prevPath);
      } catch (err) {
        console.warn('No se pudo eliminar imagen anterior:', err);
      }
    }

    await item.destroy();
    res.json({ message: 'Item eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el item' });
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // 1. Find the section
    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    const uploadsDir = path.resolve(__dirname, '../../uploads');

    // 2. Find & delete all items and their images
    const items = await ExtensionItem.findAll({ where: { section_id: section.id } });
    for (const item of items) {
      if (item.image_url && item.image_url.startsWith('/uploads/')) {
        const imgPath = path.join(uploadsDir, item.image_url.replace('/uploads/', ''));
        try { deleteFile(imgPath); } catch {}
      }
    }
    await ExtensionItem.destroy({ where: { section_id: section.id } });

    // 3. Delete section banner if local
    if (section.banner_url && section.banner_url.startsWith('/uploads/')) {
      const prevPath = path.join(uploadsDir, section.banner_url.replace('/uploads/', ''));
      try { deleteFile(prevPath); } catch {}
    }

    // 4. Delete the section
    await section.destroy();
    res.json({ message: 'Sección eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Error al eliminar la sección' });
  }
};



// --- DOCUMENTS (Gacetas / Promocion) ---


export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { category } = req.params; // 'gaceta' or 'promocion'
    const documents = await ExtensionDocument.findAll({
      where: { category },
      order: [['publication_date', 'DESC'], ['created_at', 'DESC']]
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener documentos' });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  try {
    const { category, title, publication_date } = req.body;
    
    // Validar que se subió el archivo principal
    if (!files || !files.file || files.file.length === 0) {
      return res.status(400).json({ message: 'El archivo PDF es requerido' });
    }
    
    const file = files.file[0];
    const file_url = `/uploads/extension-universitaria/documents/${file.filename}`;
    
    // Cover image es opcional
    let cover_url = null;
    if (files.cover && files.cover.length > 0) {
      const cover = files.cover[0];
      cover_url = `/uploads/extension-universitaria/documents/${cover.filename}`;
    }
    
    const mime_type = files.file[0].mimetype;
    const media_type = mime_type.startsWith('image/') ? 'image' : 'document';

    const document = await ExtensionDocument.create({
      category,
      title: title || file.originalname,
      file_url,
      cover_url: cover_url || undefined,
      publication_date: publication_date || new Date(),
      mime_type,
      media_type
    });
    
    res.status(201).json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    // Intentar limpiar archivos subidos si algo falló
    try {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      if (files && files.file && files.file.length > 0) {
        const filePath = path.join(uploadsDir, `extension-universitaria/documents/${files.file[0].filename}`);
        deleteFile(filePath);
      }
      if (files && files.cover && files.cover.length > 0) {
        const coverPath = path.join(uploadsDir, `extension-universitaria/documents/${files.cover[0].filename}`);
        deleteFile(coverPath);
      }
    } catch (cleanupErr) {
      console.warn('Error cleaning up files after create failure:', cleanupErr);
    }
    res.status(500).json({ message: 'Error al crear documento' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await ExtensionDocument.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    
    // Eliminar archivos físicos del sistema (uso deleteFile utilitario)
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    if (document.file_url && document.file_url.startsWith('/uploads/')) {
      const filePath = path.join(uploadsDir, document.file_url.replace('/uploads/', ''));
      try {
        const deleted = deleteFile(filePath);
        if (deleted) console.log('Deleted file:', filePath);
      } catch (err) {
        console.warn('Could not delete file:', err);
      }
    }

    if (document.cover_url && document.cover_url.startsWith('/uploads/')) {
      const coverPath = path.join(uploadsDir, document.cover_url.replace('/uploads/', ''));
      try {
        const deleted = deleteFile(coverPath);
        if (deleted) console.log('Deleted cover:', coverPath);
      } catch (err) {
        console.warn('Could not delete cover file:', err);
      }
    }
    
    await document.destroy();
    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error al eliminar documento' });
  }
};

// --- TOGGLE SECTION ENABLED STATUS ---

export const toggleSectionEnabled = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const section = await ExtensionSection.findOne({ where: { slug } });
    
    if (!section) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    // Toggle the is_enabled field
    await section.update({ is_enabled: !section.is_enabled });
    
    res.json({
      message: `Sección ${section.is_enabled ? 'habilitada' : 'deshabilitada'} correctamente`,
      section
    });
  } catch (error) {
    console.error('Error toggling section status:', error);
    res.status(500).json({ message: 'Error al cambiar el estado de la sección' });
  }
};
