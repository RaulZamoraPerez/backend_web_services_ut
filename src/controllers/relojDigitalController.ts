import { Request, Response } from 'express';
import RelojDigital, { RelojDigitalAttributes } from '../models/RelojDigital';

export const getRelojDigital = async (req: Request, res: Response) => {
  try {
    const reloj = await RelojDigital.findOne({
      where: { activo: true },
      order: [['updatedAt', 'DESC']],
    });

    if (!reloj) {
      // Si no existe configuración, devolver valores por defecto
      const relojDefault = {
        zonaHoraria: 'America/Mexico_City',
        formato24Horas: true,
        mostrarFecha: true,
        mostrarDiaSemana: true,
        activo: true,
        estilo: 'digital' as const,
        tema: 'light' as const,
      };

      return res.json({
        success: true,
        data: relojDefault,
      });
    }

    res.json({
      success: true,
      data: reloj,
    });
  } catch (error) {
    console.error('Error al obtener configuración del reloj digital:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const getAllRelojesDigitales = async (req: Request, res: Response) => {
  try {
    const relojes = await RelojDigital.findAll({
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      success: true,
      data: relojes,
    });
  } catch (error) {
    console.error('Error al obtener configuraciones de relojes digitales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const createRelojDigital = async (req: Request, res: Response) => {
  try {
    const relojData: RelojDigitalAttributes = req.body;

    // Validaciones básicas
    if (!relojData.zonaHoraria) {
      return res.status(400).json({
        success: false,
        message: 'La zona horaria es obligatoria',
      });
    }

    const reloj = await RelojDigital.create(relojData);

    res.status(201).json({
      success: true,
      message: 'Configuración del reloj digital creada exitosamente',
      data: reloj,
    });
  } catch (error) {
    console.error('Error al crear configuración del reloj digital:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const updateRelojDigital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<RelojDigitalAttributes> = req.body;

    const reloj = await RelojDigital.findByPk(id);

    if (!reloj) {
      return res.status(404).json({
        success: false,
        message: 'Configuración del reloj digital no encontrada',
      });
    }

    await reloj.update(updateData);

    res.json({
      success: true,
      message: 'Configuración del reloj digital actualizada exitosamente',
      data: reloj,
    });
  } catch (error) {
    console.error('Error al actualizar configuración del reloj digital:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const deleteRelojDigital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reloj = await RelojDigital.findByPk(id);

    if (!reloj) {
      return res.status(404).json({
        success: false,
        message: 'Configuración del reloj digital no encontrada',
      });
    }

    await reloj.destroy();

    res.json({
      success: true,
      message: 'Configuración del reloj digital eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar configuración del reloj digital:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};