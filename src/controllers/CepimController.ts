import { Request, Response } from 'express';
import CepimInfo from '../models/CepimInfo';
import CepimCard from '../models/CepimCard';
import CepimInfografia from '../models/CepimInfografia';
import path from 'path';
import fs from 'fs';


// === CEPIM INFO ===
export const getCepimInfo = async (req: Request, res: Response) => {
    try {
        const info = await CepimInfo.findOne({ order: [['id', 'ASC']] });
        if (!info) {
            return res.status(404).json({ message: 'No hay información de CEPIM configurada aún.' });
        }
        res.json(info);
    } catch (error) {
        console.error('Error fetching CEPIM info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCepimInfo = async (req: Request, res: Response) => {
    try {
        let info = await CepimInfo.findOne({ order: [['id', 'ASC']] });
        if (!info) {
            info = await CepimInfo.create({});
        }

        const { titulo_principal, descripcion, header_badge, header_titulo, footer_titulo, footer_descripcion, footer_ubicacion, footer_horario } = req.body;
        
        info.titulo_principal = titulo_principal || info.titulo_principal;
        info.descripcion = descripcion || info.descripcion;
        info.header_badge = header_badge || info.header_badge;
        info.header_titulo = header_titulo || info.header_titulo;
        info.footer_titulo = footer_titulo || info.footer_titulo;
        info.footer_descripcion = footer_descripcion || info.footer_descripcion;
        info.footer_ubicacion = footer_ubicacion || info.footer_ubicacion;
        info.footer_horario = footer_horario || info.footer_horario;

        if (req.file) {
            if (info.imagen && !info.imagen.startsWith('/vinculacion/')) {
                const oldPath = path.join(__dirname, '../../uploads', info.imagen.replace('/uploads/', ''));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            info.imagen = `/uploads/cepim/${req.file.filename}`;
        }

        await info.save();
        res.json(info);
    } catch (error) {
        console.error('Error updating CEPIM info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// === CEPIM CARDS ===
export const getCepimCards = async (req: Request, res: Response) => {
    try {
        const cards = await CepimCard.findAll({ order: [['id', 'ASC']] });
        res.json(cards);
    } catch (error) {
        console.error('Error fetching CEPIM cards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createCepimCard = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, icono } = req.body;
        const card = await CepimCard.create({ titulo, descripcion, icono });
        res.status(201).json(card);
    } catch (error) {
        console.error('Error creating CEPIM card:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCepimCard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, icono } = req.body;
        const card = await CepimCard.findByPk(id);
        if (!card) return res.status(404).json({ error: 'Card not found' });

        card.titulo = titulo || card.titulo;
        card.descripcion = descripcion || card.descripcion;
        card.icono = icono || card.icono;

        await card.save();
        res.json(card);
    } catch (error) {
        console.error('Error updating CEPIM card:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCepimCard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const card = await CepimCard.findByPk(id);
        if (!card) return res.status(404).json({ error: 'Card not found' });

        await card.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting CEPIM card:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// === CEPIM INFOGRAFIAS ===
export const getCepimInfografias = async (req: Request, res: Response) => {
    try {
        const items = await CepimInfografia.findAll({ order: [['id', 'DESC']] });
        res.json(items);
    } catch (error) {
        console.error('Error fetching CEPIM infografias:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createCepimInfografia = async (req: Request, res: Response) => {
    try {
        const { titulo } = req.body;
        if (!req.file) return res.status(400).json({ error: 'Image file is required' });

        const imagen_url = `/uploads/cepim/${req.file.filename}`;
        const info = await CepimInfografia.create({ titulo, imagen_url });

        res.status(201).json(info);
    } catch (error) {
        console.error('Error creating CEPIM infografia:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCepimInfografia = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await CepimInfografia.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Infografia not found' });

        if (item.imagen_url && !item.imagen_url.startsWith('/vinculacion/')) {
            const oldPath = path.join(__dirname, '../../uploads', item.imagen_url.replace('/uploads/', ''));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await item.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting CEPIM infografia:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
