import { Request, Response } from 'express';
import Comite from '../models/Comite';
import DocumentoComite from '../models/DocumentoComite';
import ComiteCategory from '../models/ComiteCategory';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getComites = async (req: Request, res: Response) => {
    try {
        const { admin, slug } = req.query;

        const includeInactive = admin === 'true';
        const whereClause: any = includeInactive ? {} : { activo: true };

        if (slug) {
            whereClause.slug = slug;
        }

        const comites = await Comite.findAll({
            where: whereClause,
            include: [{
                model: ComiteCategory,
                as: 'categorias',
                required: false,
                include: [{
                    model: DocumentoComite,
                    as: 'documentos',
                    where: includeInactive ? {} : { activo: true },
                    required: false
                }]
            }],
            order: [
                ['id', 'ASC'],
                [{ model: ComiteCategory, as: 'categorias' }, 'orden', 'ASC'],
                [{ model: ComiteCategory, as: 'categorias' }, 'id', 'ASC']
            ]
        });

        res.json(comites || []);
    } catch (error: any) {
        if (error.name === 'SequelizeDatabaseError' || error.message?.includes('doesn\'t exist')) {
            return res.json([]);
        }
        res.status(500).json({ message: 'Error al obtener comités' });
    }
};

export const getComiteBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { admin } = req.query;

        const includeInactive = admin === 'true';

        const comite = await Comite.findOne({
            where: { slug: slug },
            include: [{
                model: ComiteCategory,
                as: 'categorias',
                required: false,
                include: [{
                    model: DocumentoComite,
                    as: 'documentos',
                    where: includeInactive ? {} : { activo: true },
                    required: false
                }]
            }],
            order: [
                [{ model: ComiteCategory, as: 'categorias' }, 'orden', 'ASC'],
                [{ model: ComiteCategory, as: 'categorias' }, 'id', 'ASC']
            ]
        });

        if (!comite) {
            return res.status(404).json({ message: 'Comité no encontrado' });
        }
        res.json(comite);
    } catch (error: any) {
        if (error.name === 'SequelizeDatabaseError' || error.message?.includes('doesn\'t exist')) {
            console.error("DEBUG ERROR", error);
            return res.status(404).json({ message: 'Comité no encontrado' });
        }
        console.error("DEBUG ERROR 500", error);
        res.status(500).json({ message: 'Error al obtener el comité' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { comiteId, titulo, orden } = req.body;
        const categoria = await ComiteCategory.create({ 
            comiteId, 
            titulo,
            orden: orden !== undefined ? Number(orden) : 0
        });
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría del comité' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, orden } = req.body;
        const categoria = await ComiteCategory.findByPk(id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
        
        const updateData: any = {};
        if (titulo !== undefined) updateData.titulo = titulo;
        if (orden !== undefined) updateData.orden = Number(orden);

        await categoria.update(updateData);
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
};

export const reorderCategories = async (req: Request, res: Response) => {
    try {
        const { categories } = req.body; // Array of { id, orden }
        if (!Array.isArray(categories)) {
            return res.status(400).json({ message: 'Se requiere un arreglo de categorías' });
        }

        for (const item of categories) {
            if (item.id) {
                await ComiteCategory.update(
                    { orden: Number(item.orden || 0) },
                    { where: { id: item.id } }
                );
            }
        }
        res.json({ message: 'Categorías reordenadas correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reordenar categorías' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoria = await ComiteCategory.findByPk(id, {
            include: [{ model: DocumentoComite, as: 'documentos' }]
        });
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });

        // Borrar archivos
        const docs = (categoria as any).documentos || [];
        for (const doc of docs) {
            if (doc.archivo) deleteFile(doc.archivo);
        }

        await categoria.destroy();
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
};


export const createComite = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, activo, slug } = req.body;

        // Auto-generate slug if not provided, from titulo
        let generatedSlug = slug;
        if (!generatedSlug) {
            generatedSlug = titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // Check if already exists to prevent UniqueConstraintError
        const existingComite = await Comite.findOne({ where: { slug: generatedSlug } });
        if (existingComite) {
            return res.status(200).json(existingComite);
        }

        const comite = await Comite.create({
            slug: generatedSlug,
            titulo,
            descripcion,
            activo: activo === 'true' || activo === true
        });
        res.status(201).json(comite);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError' || error.message?.includes('Duplicate entry')) {
            // Unmount/mount race condition hit: record was just created by another request
            try {
                const existing = await Comite.findOne({ where: { slug: req.body.slug || req.body.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') } });
                if (existing) return res.status(200).json(existing);
            } catch (e) {
                // Ignore secondary find error
            }
        }
        console.error(error);
        res.status(500).json({ message: 'Error al crear comité' });
    }
};

export const updateComite = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, activo, slug } = req.body;
        const comite = await Comite.findByPk(id);
        if (!comite) return res.status(404).json({ message: 'Comité no encontrado' });

        await comite.update({
            slug: slug || comite.slug,
            titulo,
            descripcion,
            activo: activo === 'true' || activo === true
        });
        res.json(comite);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar comité' });
    }
};

export const deleteComite = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const comite = await Comite.findByPk(id, {
            include: [{ model: DocumentoComite, as: 'documentos' }]
        });
        if (!comite) return res.status(404).json({ message: 'Comité no encontrado' });

        // 1. Eliminar archivos físicos de todos los documentos del comité
        if (comite.documentos && Array.isArray(comite.documentos)) {
            for (const doc of comite.documentos) {
                if (doc.archivo) {
                    deleteFile(doc.archivo);
                }
            }
        }

        // 2. Eliminar registros de la BD (primero documentos, luego comité)
        await DocumentoComite.destroy({ where: { comiteId: id } });
        await comite.destroy();
        res.json({ message: 'Comité y sus documentos eliminados física y lógicamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comité' });
    }
};

// Document Management
export const addDocumento = async (req: Request, res: Response) => {
    try {
        let { comiteId, categoriaId, titulo, activo, enlaceAdicional } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Se requiere un archivo' });
        }

        // Fix encoding if title was parsed as latin1
        if (titulo) {
            try {
                const utf8Decoded = Buffer.from(titulo, 'latin1').toString('utf8');
                if (!utf8Decoded.includes('\uFFFD')) {
                    titulo = utf8Decoded;
                }
            } catch (e) {}
        } else if (req.file.originalname) {
            try {
                const utf8Decoded = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
                if (!utf8Decoded.includes('\uFFFD')) {
                    titulo = utf8Decoded;
                } else {
                    titulo = req.file.originalname;
                }
            } catch (e) {
                titulo = req.file.originalname;
            }
        }

        const archivoPath = `/uploads/documentos/${req.file.filename}`;

        const doc = await DocumentoComite.create({
            comiteId,
            categoriaId: categoriaId ? Number(categoriaId) : null,
            titulo: titulo || 'Documento',
            archivo: archivoPath,
            enlaceAdicional: enlaceAdicional || null,
            activo: activo === 'true' || activo === true
        });

        res.status(201).json(doc);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al agregar documento' });
    }
};

export const updateDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { titulo, activo, categoriaId, enlaceAdicional } = req.body;
        const doc = await DocumentoComite.findByPk(id);
        if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });

        if (titulo) {
            try {
                const utf8Decoded = Buffer.from(titulo, 'latin1').toString('utf8');
                if (!utf8Decoded.includes('\uFFFD')) {
                    titulo = utf8Decoded;
                }
            } catch (e) {}
        }

        const updateData: any = { 
            titulo: titulo || doc.titulo, 
            activo: activo !== undefined ? (activo === 'true' || activo === true) : doc.activo,
            categoriaId: categoriaId !== undefined && categoriaId !== null && String(categoriaId).trim() !== '' ? Number(categoriaId) : doc.categoriaId,
            enlaceAdicional: enlaceAdicional !== undefined ? enlaceAdicional : doc.enlaceAdicional
        };
        
        if (req.file) {
            if (doc.archivo) deleteFile(doc.archivo);
            updateData.archivo = `/uploads/documentos/${req.file.filename}`;
        }

        await doc.update(updateData);
        res.json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar documento' });
    }
};


export const deleteDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doc = await DocumentoComite.findByPk(id);
        if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });

        // Limpieza del archivo físico
        if (doc.archivo) {
            deleteFile(doc.archivo);
        }

        await doc.destroy();
        res.json({ message: 'Documento eliminado física y lógicamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar documento' });
    }
};
