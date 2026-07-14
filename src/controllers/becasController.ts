import { Request, Response } from 'express';
import BecaSection from '../models/BecaSection';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

// ============================================
// SECTIONS CRUD
// ============================================

// GET /api/becas/sections - Obtener todas las secciones ordenadas
export const getAllSections = async (req: Request, res: Response) => {
    try {
        const { module = 'becas' } = req.query;
        const sections = await BecaSection.findAll({
            where: { 
                active: true,
                module: module as string
            },
            order: [['order', 'ASC']]
        });

        res.json(sections);
    } catch (error) {
        console.error('Error al obtener secciones de becas:', error);
        res.status(500).json({ message: 'Error al obtener las secciones de becas' });
    }
};

// GET /api/becas/sections/:id - Obtener una sección específica
export const getSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const section = await BecaSection.findByPk(id);

        if (!section) {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }

        res.json(section);
    } catch (error) {
        console.error('Error al obtener sección:', error);
        res.status(500).json({ message: 'Error al obtener la sección' });
    }
};

// POST /api/becas/sections - Crear nueva sección
export const createSection = async (req: Request, res: Response) => {
    try {
        const { type, title, data, order, module = 'becas' } = req.body;

        // Validar tipo de sección
        const allowedTypes = ['header', 'banner', 'convocatoria', 'avisos', 'footer', 'repository', 'results', 'infographics'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: 'Tipo de sección inválido' });
        }

        // Si no se proporciona orden, obtener el siguiente disponible para ese módulo
        let sectionOrder = order;
        if (!sectionOrder) {
            const maxOrder = await BecaSection.max('order', {
                where: { module: module as string }
            }) as number | null;
            sectionOrder = (maxOrder || 0) + 1;
        }

        const section = await BecaSection.create({
            module: module as 'becas' | 'estadia',
            type,
            title,
            data: data || {},
            order: sectionOrder,
            active: true
        });

        res.status(201).json(section);
    } catch (error) {
        console.error('Error al crear sección:', error);
        res.status(500).json({ message: 'Error al crear la sección' });
    }
};

// PUT /api/becas/sections/:id - Actualizar sección
export const updateSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, data, active } = req.body;

        const section = await BecaSection.findByPk(id);
        if (!section) {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }

        if (data && data.bannerUrl && section.data && (section.data as any).bannerUrl && data.bannerUrl !== (section.data as any).bannerUrl) {
            const oldBannerUrl = (section.data as any).bannerUrl;
            if (typeof oldBannerUrl === 'string' && !oldBannerUrl.startsWith('http')) {
                const relativePath = oldBannerUrl.replace(/^\/uploads\//, '');
                if (relativePath) {
                    try {
                        deleteFile(path.join(path.resolve(__dirname, '../../uploads'), relativePath));
                    } catch (e) {
                        console.warn('Error deleting old banner on update:', e);
                    }
                }
            }
        }

        await section.update({
            ...(title !== undefined && { title }),
            ...(data !== undefined && { data }),
            ...(active !== undefined && { active })
        });

        // Recargar
        const updatedSection = await BecaSection.findByPk(id);

        res.json(updatedSection);
    } catch (error) {
        console.error('Error al actualizar sección:', error);
        res.status(500).json({ message: 'Error al actualizar la sección' });
    }
};

// DELETE /api/becas/sections/:id - Eliminar sección
export const deleteSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const section = await BecaSection.findByPk(id);

        if (!section) {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }

        // Intentar eliminar imagen física si existe en el campo data.bannerUrl
        const sectionData = section.data as any;
        if (sectionData && sectionData.bannerUrl && typeof sectionData.bannerUrl === 'string') {
            const relativePath = sectionData.bannerUrl.replace(/^\/uploads\//, '');
            if (relativePath && !relativePath.startsWith('http')) {
                deleteFile(path.join(path.resolve(__dirname, '../../uploads'), relativePath));
            }
        }

        await section.destroy();
        res.json({ message: 'Sección eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar sección:', error);
        res.status(500).json({ message: 'Error al eliminar la sección' });
    }
};


// PUT /api/becas/sections/reorder - Reordenar secciones
export const reorderSections = async (req: Request, res: Response) => {
    try {
        const { sections } = req.body; // Array de { id, order }

        if (!Array.isArray(sections)) {
            return res.status(400).json({ message: 'Se esperaba un array de secciones' });
        }

        // Actualizar el orden de cada sección
        for (const item of sections) {
            await BecaSection.update(
                { order: item.order },
                { where: { id: item.id } }
            );
        }

        // Obtener todas las secciones actualizadas
        const updatedSections = await BecaSection.findAll({
            where: { active: true },
            order: [['order', 'ASC']]
        });

        res.json(updatedSections);
    } catch (error) {
        console.error('Error al reordenar secciones:', error);
        res.status(500).json({ message: 'Error al reordenar las secciones' });
    }
};


// POST /api/becas/upload-image - Subir imagen para banner
export const uploadBannerImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó archivo' });
        }

        // Construir URL del archivo
        const uploadsDir = path.resolve(__dirname, '../../uploads');
        const resolvedFile = path.resolve(req.file.path);
        let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
        const file_url = `/uploads/${relativePath}`;

        res.status(201).json({ url: file_url });
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({ message: 'Error al subir la imagen' });
    }
};
