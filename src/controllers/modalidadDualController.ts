import { Request, Response } from 'express';
import ModalidadDualConfig from '../models/ModalidadDualConfig';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getConfig = async (req: Request, res: Response) => {
    try {
        let config = await ModalidadDualConfig.findOne();
        if (!config) {
            config = await ModalidadDualConfig.create({
                titulo: '',
                descripcion: '',
                periodo: '',
                videoUrl: null,
                convocatoriaImg: null,
                carreras: [],
                requisitos: [],
                faqs: []
            });
        }
        res.json(config);
    } catch (error: any) {
        res.status(500).json({ error: 'Error fetching Modalidad Dual config', details: error.message });
    }
};

export const updateConfig = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, periodo, carreras, requisitos, faqs } = req.body;
        let config = await ModalidadDualConfig.findOne();
        
        let parsedCarreras = carreras;
        let parsedRequisitos = requisitos;
        let parsedFaqs = faqs;
        if (typeof carreras === 'string')
            parsedCarreras = JSON.parse(carreras);
        if (typeof requisitos === 'string')
            parsedRequisitos = JSON.parse(requisitos);
        if (typeof faqs === 'string')
            parsedFaqs = JSON.parse(faqs);
            
        const updateData: any = {
            titulo,
            descripcion,
            periodo,
            carreras: parsedCarreras,
            requisitos: parsedRequisitos,
            faqs: parsedFaqs
        };
        
        if (req.body.deleteVideo === 'true') updateData.videoUrl = null;
        if (req.body.deleteImg === 'true') updateData.convocatoriaImg = null;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        if (config) {
            if (req.body.deleteVideo === 'true' || (files && files['videoUrl'] && files['videoUrl'][0])) {
                if (config.videoUrl && config.videoUrl.startsWith('/uploads/modalidad/')) {
                    deleteFile(config.videoUrl.replace(/^\//, ''));
                }
            }
            if (req.body.deleteImg === 'true' || (files && files['convocatoriaImg'] && files['convocatoriaImg'][0])) {
                if (config.convocatoriaImg && config.convocatoriaImg.startsWith('/uploads/modalidad/')) {
                    deleteFile(config.convocatoriaImg.replace(/^\//, ''));
                }
            }
        }
        
        if (files) {
            if (files['videoUrl'] && files['videoUrl'][0]) {
                updateData.videoUrl = `/uploads/modalidad/${files['videoUrl'][0].filename}`;
            }
            if (files['convocatoriaImg'] && files['convocatoriaImg'][0]) {
                updateData.convocatoriaImg = `/uploads/modalidad/${files['convocatoriaImg'][0].filename}`;
            }
        }
        
        if (!config) {
            config = await ModalidadDualConfig.create(updateData);
        }
        else {
            await config.update(updateData);
        }
        res.json(config);
    }
    catch (error: any) {
        console.error('Error updating Modalidad Dual config:', error);
        res.status(500).json({ error: 'Error updating Modalidad Dual config', details: error.message });
    }
};
