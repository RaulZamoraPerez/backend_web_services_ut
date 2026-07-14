import { Request, Response } from 'express';
import { PromocionInstitucionalCategoria, PromocionInstitucionalDocumento } from '../models/associations';
import path from 'path';
import fs from 'fs';

// Helper for file paths
const UPLOADS_DIR = path.join(__dirname, '../../uploads/educacion_continua/documentos');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ==========================================
// PÚBLICO
// ==========================================

export const obtenerDocumentosPublicos = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await PromocionInstitucionalCategoria.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']],
      include: [
        {
          model: PromocionInstitucionalDocumento,
          as: 'documentos',
          where: { activo: true },
          required: false, // LEFT JOIN (trae categorías incluso sin documentos)
        },
      ],
    });
    
    // Sort documents within categories
    categorias.forEach((cat: any) => {
      if (cat.documentos && Array.isArray(cat.documentos)) {
        cat.documentos.sort((a: any, b: any) => a.orden - b.orden);
      }
    });

    res.json(categorias);
  } catch (error: any) {
    console.error('Error al obtener documentos públicos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ==========================================
// CATEGORÍAS (ADMIN)
// ==========================================

export const obtenerCategoriasAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await PromocionInstitucionalCategoria.findAll({
      order: [['orden', 'ASC']],
      include: [
        {
          model: PromocionInstitucionalDocumento,
          as: 'documentos',
          required: false,
        },
      ],
    });
    
    // Sort documents within categories
    categorias.forEach((cat: any) => {
      if (cat.documentos && Array.isArray(cat.documentos)) {
        cat.documentos.sort((a: any, b: any) => a.orden - b.orden);
      }
    });

    res.json(categorias);
  } catch (error: any) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const crearCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, orden, activo } = req.body;
    if (!titulo) {
      res.status(400).json({ error: 'El título es requerido' });
      return;
    }

    const nueva = await PromocionInstitucionalCategoria.create({
      titulo,
      orden: orden ? parseInt(orden, 10) : 0,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : true
    });

    res.status(201).json(nueva);
  } catch (error: any) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const actualizarCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, orden, activo } = req.body;

    const categoria = await PromocionInstitucionalCategoria.findByPk(id);
    if (!categoria) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    if (titulo !== undefined) categoria.titulo = titulo;
    if (orden !== undefined) categoria.orden = orden;
    if (activo !== undefined) categoria.activo = activo;

    await categoria.save();
    res.json(categoria);
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const categoria = await PromocionInstitucionalCategoria.findByPk(id);
    if (!categoria) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    // Eliminar archivos físicos de todos los documentos hijos antes de destruir la categoría
    const documentos = await PromocionInstitucionalDocumento.findAll({ where: { categoria_id: id } });
    for (const doc of documentos) {
      if (doc.archivo) {
        const relative = (doc.archivo as string).replace(/^\//, '');
        const filePath = path.join(__dirname, '../../', relative);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { console.error('Error al borrar archivo físico de doc hijo:', e); }
        }
      }
    }

    await categoria.destroy();
    res.json({ message: 'Categoría eliminada' });
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ==========================================
// DOCUMENTOS (ADMIN)
// ==========================================

export const obtenerDocumentosAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria_id } = req.query;
    
    const whereClause: any = {};
    if (categoria_id) {
      whereClause.categoria_id = categoria_id;
    }

    const documentos = await PromocionInstitucionalDocumento.findAll({
      where: whereClause,
      order: [['orden', 'ASC']],
      include: [{ model: PromocionInstitucionalCategoria, as: 'categoria', attributes: ['titulo'] }]
    });

    res.json(documentos);
  } catch (error: any) {
    console.error('Error al obtener documentos admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const crearDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, categoria_id, orden, activo, archivo } = req.body;

    if (!titulo || !categoria_id || !archivo) {
      res.status(400).json({ error: 'Título, categoría y archivo son requeridos' });
      return;
    }

    const nuevoDoc = await PromocionInstitucionalDocumento.create({
      titulo,
      categoria_id: parseInt(categoria_id, 10),
      archivo,
      orden: orden ? parseInt(orden, 10) : 0,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : true
    });

    res.status(201).json(nuevoDoc);
  } catch (error: any) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const actualizarDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, categoria_id, orden, activo, archivo } = req.body;

    const documento = await PromocionInstitucionalDocumento.findByPk(id);
    if (!documento) {
      res.status(404).json({ error: 'Documento no encontrado' });
      return;
    }

    if (titulo !== undefined) documento.titulo = titulo;
    if (categoria_id !== undefined) documento.categoria_id = parseInt(categoria_id, 10);
    if (orden !== undefined) documento.orden = parseInt(orden, 10);
    if (activo !== undefined) documento.activo = activo === 'true' || activo === true;

    if (archivo) {
      // Eliminar archivo anterior si existe
      if (documento.archivo) {
        const relative = documento.archivo.replace(/^\//, '');
        const oldPath = path.join(__dirname, '../../', relative);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error('Error al eliminar archivo viejo', e); }
        }
      }
      documento.archivo = archivo;
    }

    await documento.save();
    res.json(documento);
  } catch (error: any) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarDocumento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const documento = await PromocionInstitucionalDocumento.findByPk(id);
    
    if (!documento) {
      res.status(404).json({ error: 'Documento no encontrado' });
      return;
    }

    if (documento.archivo) {
      const filePath = path.join(__dirname, '../../', documento.archivo);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.error('Error al borrar archivo físico', e); }
      }
    }

    await documento.destroy();
    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
