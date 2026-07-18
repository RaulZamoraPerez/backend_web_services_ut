import { Request, Response } from 'express';
import SiteConfig from '../models/SiteConfig';

/**
 * GET /api/site-config
 * Ruta pública — devuelve la configuración global del sitio.
 * Si no existe ningún registro, crea uno con valores por defecto.
 */
export const getSiteConfig = async (_req: Request, res: Response) => {
  try {
    let config = await SiteConfig.findOne({ order: [['updatedAt', 'DESC']] });

    if (!config) {
      config = await SiteConfig.create({ modo_electoral: false });
    }

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Error al obtener configuración del sitio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

/**
 * PUT /api/site-config
 * Ruta protegida (JWT) — actualiza la configuración global del sitio.
 */
export const updateSiteConfig = async (req: Request, res: Response) => {
  try {
    const { modo_electoral } = req.body;

    if (typeof modo_electoral !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo modo_electoral debe ser un booleano.',
      });
    }

    let config = await SiteConfig.findOne({ order: [['updatedAt', 'DESC']] });

    if (!config) {
      config = await SiteConfig.create({ modo_electoral });
    } else {
      await config.update({ modo_electoral });
    }

    res.json({
      success: true,
      message: `Modo electoral ${modo_electoral ? 'activado' : 'desactivado'} correctamente.`,
      data: config,
    });
  } catch (error) {
    console.error('Error al actualizar configuración del sitio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
