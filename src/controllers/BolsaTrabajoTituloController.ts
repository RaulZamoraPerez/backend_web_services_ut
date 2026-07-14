import { Request, Response } from 'express';
import BolsaTrabajoTitulo from '../models/BolsaTrabajoTitulo';

export const getBolsaTrabajoTitulo = async (req: Request, res: Response) => {
    try {
        let titulo = await BolsaTrabajoTitulo.findOne({ order: [['id', 'ASC']] });
        if (!titulo) {
            titulo = await BolsaTrabajoTitulo.create({ titulo: 'Bolsa de Trabajo' });
        }
        res.json(titulo);
    } catch (error) {
        console.error('Error getting BolsaTrabajo titulo:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

    export const updateBolsaTrabajoTitulo = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion } = req.body;
        let tituloRecord = await BolsaTrabajoTitulo.findOne({ order: [['id', 'ASC']] });
        
        if (!tituloRecord) {
            tituloRecord = await BolsaTrabajoTitulo.create({ 
                titulo: titulo || 'Bolsa de Trabajo',
                descripcion: descripcion || 'Explora las últimas vacantes de empleo y oportunidades profesionales de nuestra bolsa de trabajo.'
            });
        } else {
            tituloRecord.titulo = titulo || 'Bolsa de Trabajo';
            if (descripcion !== undefined) {
                tituloRecord.descripcion = descripcion;
            }
            await tituloRecord.save();
        }
        
        res.json(tituloRecord);
    } catch (error) {
        console.error('Error updating BolsaTrabajo titulo:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
