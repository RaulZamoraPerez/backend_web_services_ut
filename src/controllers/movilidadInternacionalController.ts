import { Request, Response } from 'express';
import MovilidadInternacional from '../models/MovilidadInternacional';
import fs from 'fs';
import path from 'path';

export const getMovilidadInternacional = async (req: Request, res: Response) => {
    try {
        const items = await MovilidadInternacional.findAll({
            order: [['orden', 'ASC']],
            where: { activo: true }
        });
        res.json(items);
    } catch (error) {
        console.error('Error al obtener movilidad internacional:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createMovilidadInternacional = async (req: Request, res: Response) => {
    try {
        const { titulo, tipo, orden, activo } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        // Multer guarda en 'uploads/movilidad', así que la ruta relativa es 'movilidad/filename'
        const savedFilePath = `movilidad/${req.file.filename}`;

        const newItem = await MovilidadInternacional.create({
            titulo,
            archivo: savedFilePath,
            tipo: tipo || 'pdf',
            orden: orden ? parseInt(orden) : 0,
            activo: activo === 'true' || activo === true
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error al crear movilidad internacional:', error);
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

export const updateMovilidadInternacional = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, tipo, orden, activo } = req.body;

        const item = await MovilidadInternacional.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

        let savedFilePath = item.archivo;

        if (req.file) {
            const oldFilePath = path.join(__dirname, '../../uploads', item.archivo);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            savedFilePath = `movilidad/${req.file.filename}`;
        }

        await item.update({
            titulo,
            archivo: savedFilePath,
            tipo,
            orden: orden ? parseInt(orden) : item.orden,
            activo: activo !== undefined ? (activo === 'true' || activo === true) : item.activo
        });

        res.json(item);
    } catch (error) {
        console.error('Error al actualizar movilidad internacional:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteMovilidadInternacional = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await MovilidadInternacional.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

        // Intentar borrar archivo físico, pero no detener si falla
        try {
            const filePath = path.join(__dirname, '../../uploads', item.archivo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (fileError) {
            console.error('Error al eliminar archivo físico (se continuará con la eliminación en BD):', fileError);
        }

        await item.destroy();
        res.json({ message: 'Elemento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar movilidad internacional:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
