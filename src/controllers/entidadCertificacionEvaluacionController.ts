import { Request, Response } from 'express';
import EntidadCertificacionEvaluacion from '../models/EntidadCertificacionEvaluacion';
import EntidadCertificacionInfo from '../models/EntidadCertificacionInfo';
import fs from 'fs';
import path from 'path';

export const getEntidadResources = async (req: Request, res: Response) => {
    try {
        const items = await EntidadCertificacionEvaluacion.findAll({
            order: [['orden', 'ASC']],
            where: { activo: true }
        });
        
        const mappedItems = items.map(item => ({
            id: item.id,
            titulo: item.titulo,
            descripcion: item.descripcion,
            url: `/uploads/${item.archivo}`,
            tipo: item.tipo,
            fecha_subida: item.createdAt,
            is_active: item.activo
        }));
        res.json(mappedItems);
    } catch (error) {
        console.error('Error al obtener recursos de entidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createEntidadResource = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, tipo, orden } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        // The file is saved in 'uploads/entidad-certificacion' by multer
        // We store the relative path 'entidad-certificacion/filename'
        const savedFilePath = `entidad-certificacion/${req.file.filename}`;

        const newItem = await EntidadCertificacionEvaluacion.create({
            titulo,
            descripcion,
            archivo: savedFilePath,
            tipo: tipo || 'image',
            orden: orden ? parseInt(orden) : 0,
            activo: true
        });

        res.status(201).json({
            id: newItem.id,
            titulo: newItem.titulo,
            descripcion: newItem.descripcion,
            url: `/uploads/${newItem.archivo}`,
            tipo: newItem.tipo,
            fecha_subida: newItem.createdAt,
            is_active: newItem.activo
        });
    } catch (error) {
        console.error('Error al crear recurso de entidad:', error);
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error al eliminar archivo tras fallo:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteEntidadResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await EntidadCertificacionEvaluacion.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

        const filePath = path.join(__dirname, '../../uploads', item.archivo);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            console.error('Error deleting file:', e);
        }

        await item.destroy();
        res.json({ message: 'Elemento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar recurso de entidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateEntidadResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, is_active } = req.body;

        const item = await EntidadCertificacionEvaluacion.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

        await item.update({
            titulo: titulo || item.titulo,
            descripcion: descripcion !== undefined ? descripcion : item.descripcion,
            activo: is_active !== undefined ? is_active : item.activo
        });

        res.json({
            id: item.id,
            titulo: item.titulo,
            descripcion: item.descripcion,
            url: `/uploads/${item.archivo}`,
            tipo: item.tipo,
            fecha_subida: item.createdAt,
            is_active: item.activo
        });
    } catch (error) {
        console.error('Error al actualizar recurso de entidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getEntidadInfo = async (req: Request, res: Response) => {
    try {
        let info = await EntidadCertificacionInfo.findOne({ order: [['id', 'ASC']] });
        if (!info) {
            info = await EntidadCertificacionInfo.create({});
        }
        res.json(info);
    } catch (error) {
        console.error('Error fetching Entidad info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateEntidadInfo = async (req: Request, res: Response) => {
    try {
        let info = await EntidadCertificacionInfo.findOne({ order: [['id', 'ASC']] });
        if (!info) {
            info = await EntidadCertificacionInfo.create({});
        }

        const { titulo_principal, descripcion, header_badge, header_titulo, header_descripcion, footer_titulo, footer_descripcion, footer_ubicacion, footer_horario, card1_titulo, card1_descripcion, card2_titulo, card2_descripcion } = req.body;
        
        info.titulo_principal = titulo_principal || info.titulo_principal;
        info.descripcion = descripcion || info.descripcion;
        info.header_badge = header_badge || info.header_badge;
        info.header_titulo = header_titulo || info.header_titulo;
        info.header_descripcion = header_descripcion || info.header_descripcion;
        info.footer_titulo = footer_titulo || info.footer_titulo;
        info.footer_descripcion = footer_descripcion || info.footer_descripcion;
        info.footer_ubicacion = footer_ubicacion || info.footer_ubicacion;
        info.footer_horario = footer_horario || info.footer_horario;
        info.card1_titulo = card1_titulo || info.card1_titulo;
        info.card1_descripcion = card1_descripcion || info.card1_descripcion;
        info.card2_titulo = card2_titulo || info.card2_titulo;
        info.card2_descripcion = card2_descripcion || info.card2_descripcion;

        if (req.file) {
            if (info.imagen && !info.imagen.startsWith('/vinculacion/')) {
                const oldPath = path.join(__dirname, '../../uploads', info.imagen.replace('/uploads/', ''));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            info.imagen = `/uploads/entidad-certificacion/${req.file.filename}`;
        }

        await info.save();
        res.json(info);
    } catch (error) {
        console.error('Error updating Entidad info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

