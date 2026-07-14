import { Request, Response } from 'express';
import NormatividadCategory from '../models/NormatividadCategory';
import NormatividadDocument from '../models/NormatividadDocument';
import path from 'path';
import fs from 'fs';
import { deleteFile } from '../middleware/uploadMiddleware';

export async function getAll(req: Request, res: Response) {
    try {
        const cats = await NormatividadCategory.findAll({
            include: [{ model: NormatividadDocument, as: 'documentos' }],
            order: [['id', 'ASC'], [{ model: NormatividadDocument, as: 'documentos' }, 'id', 'ASC']]
        });
        return res.json(cats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error obteniendo normatividad' });
    }
}

export async function createCategory(req: Request, res: Response) {
    try {
        const { key, titulo } = req.body;
        if (!key || !titulo) return res.status(400).json({ message: 'key y titulo son requeridos' });
        const cat = await NormatividadCategory.create({ key, titulo });
        return res.status(201).json(cat);
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Error creando categoría' });
    }
}

export async function createDocument(req: Request, res: Response) {
    try {
        const categoriaId = parseInt(req.params.categoriaId, 10);
        const categoria = await NormatividadCategory.findByPk(categoriaId);

        if (!categoria) {
            if (req.body?.archivo) {
                try {
                    const relative = String(req.body.archivo).replace(/^\//, '');
                    const fullPath = path.join(__dirname, '../../', relative);
                    if (fs.existsSync(fullPath)) {
                        deleteFile(fullPath);
                    }
                } catch (e) {
                    console.error('Error deleting uploaded file for invalid category:', e);
                }
            }

            return res.status(404).json({ message: 'La categoría no existe' });
        }

        // soportar tanto JSON como multipart/form-data (middleware de upload llena req.body.archivo y req.body.archivo_name)
        const { titulo: tituloRaw, archivo, archivo_name } = req.body as { titulo?: string; archivo?: string; archivo_name?: string };

        // Derivar título si no se envía explicítamente
        let titulo = tituloRaw && String(tituloRaw).trim();
        if (!titulo) {
            if (archivo_name && String(archivo_name).trim()) {
                titulo = String(archivo_name).trim();
            } else if (archivo && String(archivo).trim()) {
                // archivo puede ser '/uploads/normatividad/filename.pdf' -> extraer basename
                try {
                    const parts = String(archivo).split('/');
                    const basename = parts[parts.length - 1] || parts[parts.length - 2] || '';
                    titulo = basename.replace(/_[0-9]+_[a-f0-9]{8,}/i, '').replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
                } catch (e) {
                    titulo = '';
                }
            }
        }

        if (!categoriaId || !titulo || !archivo) return res.status(400).json({ message: 'categoriaId, titulo y archivo son requeridos' });

        const doc = await NormatividadDocument.create({ categoriaId, titulo, archivo, archivo_name });
        return res.status(201).json(doc);
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: err.message || 'Error creando documento' });
    }
}

export async function updateDocument(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        // archivo comes from middleware if file uploaded
        const { titulo, archivo, archivo_name } = req.body;

        const doc = await NormatividadDocument.findByPk(id);
        if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });

        const updates: any = {};
        if (titulo !== undefined) updates.titulo = titulo;

        if (archivo) {
            // New file uploaded
            // Delete old file
            if (doc.archivo) {
                try {
                    const relative = doc.archivo.replace(/^\//, '');
                    const fullPath = path.join(__dirname, '../../', relative);
                    deleteFile(fullPath);
                } catch (e) {
                    console.error('Error deleting old file:', e);
                }
            }
            updates.archivo = archivo;
            if (archivo_name) updates.archivo_name = archivo_name;
        }

        await doc.update(updates);
        return res.json(doc);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error actualizando documento' });
    }
}

export async function deleteDocument(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const doc = await NormatividadDocument.findByPk(id);
        if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });
        // intentar eliminar archivo asociado si existe
        try {
            if (doc.archivo && typeof doc.archivo === 'string') {
                // doc.archivo expected like '/uploads/normatividad/filename'
                const relative = doc.archivo.replace(/^\//, '');
                const fullPath = path.join(__dirname, '../../', relative);
                deleteFile(fullPath);
            }
        } catch (e) {
            console.error('Error eliminando archivo asociado:', e);
        }
        await doc.destroy();
        return res.json({ message: 'Documento eliminado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error eliminando documento' });
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const { titulo } = req.body;
        if (!titulo) return res.status(400).json({ message: 'titulo es requerido' });

        const cat = await NormatividadCategory.findByPk(id);
        if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

        // ESTÁNDAR LIMPIO: No actualizamos la 'key' ni renombramos la carpeta.
        // La 'key' sirve como identificador único permanente (Permalink) para rutas y carpetas.
        // Si cambiamos el título visual, la URL/Carpeta original debe mantenerse para no romper enlaces externos ni referencias.
        await cat.update({ titulo });

        return res.json(cat);
    } catch (err) {
        console.error(err);
        if ((err as any).name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }
        return res.status(500).json({ message: 'Error actualizando categoría' });
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const cat = await NormatividadCategory.findByPk(id, {
            include: [{ model: NormatividadDocument, as: 'documentos' }]
        });

        if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

        // 1. Delete files for all documents in this category (standard cleanup)
        if ((cat as any).documentos && Array.isArray((cat as any).documentos)) {
            for (const doc of (cat as any).documentos) {
                if (doc.archivo) {
                    try {
                        const relative = doc.archivo.replace(/^\//, '');
                        const fullPath = path.join(__dirname, '../../', relative);
                        deleteFile(fullPath);
                    } catch (e) {
                        console.error(`Error deleting file for doc ${doc.id} during category delete:`, e);
                    }
                }
            }
        }

        // 2. Remove the category folder itself (Clean cleanup)
        const key = (cat as any).key;
        if (key) {
            try {
                const folderPath = path.join(__dirname, '../../uploads/normatividad', key);
                if (fs.existsSync(folderPath)) {
                    // Force remove folder and potential leftover contents
                    fs.rmSync(folderPath, { recursive: true, force: true });
                }
            } catch (e) {
                console.warn(`Could not remove category folder for ${key}:`, e);
            }
        }

        // 3. Destroy DB records
        await NormatividadDocument.destroy({ where: { categoriaId: id } });
        await cat.destroy();

        return res.json({ message: 'Categoría y sus documentos eliminados' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error eliminando categoría' });
    }
}
