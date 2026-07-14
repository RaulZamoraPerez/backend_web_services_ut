import { Request, Response } from 'express';
import VideoInstitucional, { VideoInstitucionalAttributes } from '../models/VideoInstitucional';

export const getVideoInstitucional = async (req: Request, res: Response) => {
  try {
    const video = await VideoInstitucional.findOne({
      where: { activo: true },
      order: [['updatedAt', 'DESC']],
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un video institucional activo',
      });
    }

    res.json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error('Error al obtener video institucional:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const getAllVideosInstitucionales = async (req: Request, res: Response) => {
  try {
    const videos = await VideoInstitucional.findAll({
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('Error al obtener videos institucionales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const createVideoInstitucional = async (req: Request, res: Response) => {
  try {
    const videoData: VideoInstitucionalAttributes = req.body;

    // Validaciones básicas
    if (!videoData.titulo || !videoData.urlVideo) {
      return res.status(400).json({
        success: false,
        message: 'Título y URL del video son obligatorios',
      });
    }

    const video = await VideoInstitucional.create(videoData);

    res.status(201).json({
      success: true,
      message: 'Video institucional creado exitosamente',
      data: video,
    });
  } catch (error) {
    console.error('Error al crear video institucional:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const updateVideoInstitucional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<VideoInstitucionalAttributes> = req.body;

    const video = await VideoInstitucional.findByPk(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video institucional no encontrado',
      });
    }

    await video.update(updateData);

    res.json({
      success: true,
      message: 'Video institucional actualizado exitosamente',
      data: video,
    });
  } catch (error) {
    console.error('Error al actualizar video institucional:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const deleteVideoInstitucional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await VideoInstitucional.findByPk(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video institucional no encontrado',
      });
    }

    await video.destroy();

    res.json({
      success: true,
      message: 'Video institucional eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar video institucional:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};