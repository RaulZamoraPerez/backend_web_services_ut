import { Request, Response } from 'express';
import BolsaTrabajoHeader from '../models/BolsaTrabajoHeader';
import BolsaTrabajoItem from '../models/BolsaTrabajoItem';
import fs from 'fs';
import path from 'path';

// Get all data (List of Sections)
export const getBolsaTrabajo = async (req: Request, res: Response) => {
    try {
        const sections = await BolsaTrabajoHeader.findAll({
            include: [{ 
                model: BolsaTrabajoItem, 
                as: 'items',
                required: false 
            }],
            order: [
                ['id', 'ASC'],
                [{ model: BolsaTrabajoItem, as: 'items' }, 'orden', 'ASC']
            ]
        });

        // Transform response to match frontend expectation while keeping backward compatibility
        const response = sections.map(section => {
            const plainSection = section.get({ plain: true });
            const items = plainSection.items || [];
            
            const images: string[] = [];
            const pdfs: any[] = [];

            // Base URL for assets
            const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

            items.forEach((item: any) => {
                const ext = path.extname(item.archivo_pdf).toLowerCase();
                const fullUrl = `${baseUrl}${item.archivo_pdf}`;
                
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                    images.push(fullUrl);
                } else {
                    // Default to PDF/Doc for other extensions
                    pdfs.push({
                        name: item.titulo,
                        url: fullUrl
                    });
                }
            });

            return {
                ...plainSection,
                // Frontend aliases
                title: plainSection.titulo,
                description: plainSection.descripcion,
                bannerUrl: plainSection.imagen_banner ? `${baseUrl}${plainSection.imagen_banner}` : null,
                externalUrl: plainSection.url_externa,
                images,
                pdfs
            };
        });

        res.json(response);
    } catch (error) {
        console.error('Error getting Bolsa Trabajo:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create Section (Header)
export const createHeader = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, url_externa } = req.body;
        let imagen_banner = null;

        if (req.file) {
            imagen_banner = `bolsa-trabajo/${req.file.filename}`;
        }

        const header = await BolsaTrabajoHeader.create({
            titulo,
            descripcion,
            url_externa,
            imagen_banner
        });

        res.status(201).json(header);
    } catch (error) {
        console.error('Error creating header:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Section (Header)
export const updateHeader = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Now we expect ID
        const { titulo, descripcion, url_externa, delete_banner } = req.body;
        
        const header = await BolsaTrabajoHeader.findByPk(id);
        if (!header) return res.status(404).json({ message: 'Section not found' });

        let imagen_banner = header.imagen_banner;

        if (delete_banner === 'true') {
             if (imagen_banner) {
                 const oldPath = path.join(__dirname, '../../uploads', imagen_banner);
                 try {
                     if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                 } catch (e) { console.error('Error deleting old banner', e); }
             }
             imagen_banner = null;
        }

        if (req.file) {
            // Delete old banner if exists
            if (imagen_banner) {
                 const oldPath = path.join(__dirname, '../../uploads', imagen_banner);
                 try {
                     if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                 } catch (e) { console.error('Error deleting old banner', e); }
            }
            imagen_banner = `bolsa-trabajo/${req.file.filename}`;
        }

        await header.update({
            titulo,
            descripcion,
            url_externa,
            imagen_banner
        });

        res.json(header);
    } catch (error) {
        console.error('Error updating header:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Section (Header)
export const deleteHeader = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const header = await BolsaTrabajoHeader.findByPk(id);
        if (!header) return res.status(404).json({ message: 'Section not found' });

        // Delete banner
        if (header.imagen_banner) {
            const filePath = path.join(__dirname, '../../uploads', header.imagen_banner);
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) { console.error('Error deleting banner', e); }
        }

        // Items will be deleted by CASCADE if configured in DB, but let's be safe and delete files
        const items = await BolsaTrabajoItem.findAll({ where: { header_id: id } });
        for (const item of items) {
            const filePath = path.join(__dirname, '../../uploads', item.archivo_pdf);
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) { console.error('Error deleting pdf', e); }
            await item.destroy();
        }

        await header.destroy();
        res.json({ message: 'Section deleted' });
    } catch (error) {
        console.error('Error deleting header:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create Item (PDF)
export const createItem = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, orden, header_id } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        if (!header_id) return res.status(400).json({ message: 'Header ID required' });

        const archivo_pdf = `bolsa-trabajo/${req.file.filename}`;

        const item = await BolsaTrabajoItem.create({
            titulo,
            descripcion,
            archivo_pdf,
            orden: orden ? parseInt(orden) : 0,
            header_id: parseInt(header_id)
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Item
export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, orden } = req.body;
        const item = await BolsaTrabajoItem.findByPk(id);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        let archivo_pdf = item.archivo_pdf;
        if (req.file) {
             const oldPath = path.join(__dirname, '../../uploads', archivo_pdf);
             try {
                 if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
             } catch (e) { console.error('Error deleting old pdf', e); }
             archivo_pdf = `bolsa-trabajo/${req.file.filename}`;
        }

        await item.update({
            titulo,
            descripcion,
            orden: orden ? parseInt(orden) : item.orden,
            archivo_pdf
        });

        res.json(item);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Item
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await BolsaTrabajoItem.findByPk(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const filePath = path.join(__dirname, '../../uploads', item.archivo_pdf);
        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) { console.error('Error deleting file', e); }

        await item.destroy();
        res.json({ message: 'Item deleted' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
