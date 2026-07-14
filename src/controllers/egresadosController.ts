import { Request, Response } from 'express';
import EgresadosInfo from '../models/EgresadosInfo';
import EgresadosBanner from '../models/EgresadosBanner';
import fs from 'fs';
import path from 'path';

// INFO
export const getInfo = async (req: Request, res: Response) => {
    try {
        let info = await EgresadosInfo.findOne({ order: [['id', 'ASC']] });
        if (!info) {
            info = await EgresadosInfo.create({ titulo_principal: 'Encuentro de Egresados' });
        }
        res.json(info);
    } catch (error) {
        console.error('Error in getInfo:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateInfo = async (req: Request, res: Response) => {
    try {
        const { titulo_principal } = req.body;
        let info = await EgresadosInfo.findOne({ order: [['id', 'ASC']] });
        if (!info) {
            info = await EgresadosInfo.create({ titulo_principal: titulo_principal || 'Encuentro de Egresados' });
        } else {
            info.titulo_principal = titulo_principal || 'Encuentro de Egresados';
            await info.save();
        }
        res.json(info);
    } catch (error) {
        console.error('Error in updateInfo:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// BANNERS
export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await EgresadosBanner.findAll({ order: [['createdAt', 'DESC']] });
        res.json(banners);
    } catch (error) {
        console.error('Error in getBanners:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getBannersActivos = async (req: Request, res: Response) => {
    try {
        const banners = await EgresadosBanner.findAll({ 
            where: { estado: true },
            order: [['createdAt', 'DESC']] 
        });
        res.json(banners);
    } catch (error) {
        console.error('Error in getBannersActivos:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createBanner = async (req: Request, res: Response) => {
    try {
        const { titulo } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Se requiere una imagen' });
        }
        
        const imagen = `egresados/${req.file.filename}`;
        
        const banner = await EgresadosBanner.create({
            titulo,
            imagen,
            estado: true
        });
        
        res.status(201).json(banner);
    } catch (error) {
        console.error('Error in createBanner:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, estado } = req.body;
        
        const banner = await EgresadosBanner.findByPk(id);
        if (!banner) return res.status(404).json({ message: 'Banner no encontrado' });
        
        let imagen = banner.imagen;
        if (req.file) {
            // Delete old file
            const oldPath = path.join(__dirname, '../../uploads', banner.imagen);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            imagen = `egresados/${req.file.filename}`;
        }
        
        await banner.update({
            titulo: titulo !== undefined ? titulo : banner.titulo,
            imagen,
            estado: estado !== undefined ? estado === 'true' || estado === true : banner.estado
        });
        
        res.json(banner);
    } catch (error) {
        console.error('Error in updateBanner:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const banner = await EgresadosBanner.findByPk(id);
        if (!banner) return res.status(404).json({ message: 'Banner no encontrado' });
        
        const filePath = path.join(__dirname, '../../uploads', banner.imagen);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        await banner.destroy();
        res.json({ message: 'Banner eliminado' });
    } catch (error) {
        console.error('Error in deleteBanner:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
