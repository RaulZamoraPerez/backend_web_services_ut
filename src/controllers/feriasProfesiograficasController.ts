import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import FeriasProfesiograficasCurso from '../models/FeriasProfesiograficasCurso';
import FeriasProfesiograficasInfo from '../models/FeriasProfesiograficasInfo';
import FeriasProfesiograficasVideo from '../models/FeriasProfesiograficasVideo';
import FeriasProfesiograficasBanner from '../models/FeriasProfesiograficasBanner';

// --- INFO CONTROLLERS ---

export const getInfo = async (req: Request, res: Response) => {
  try {
    let info = await FeriasProfesiograficasInfo.findOne();
    if (!info) {
      info = await FeriasProfesiograficasInfo.create({
        titulo_principal: 'Cursos de Ferias Profesiográficas',
        descripcion_final: '¡Descubre nuestros cursos y potencia tu desarrollo profesional!'
      });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información', error });
  }
};

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const { titulo_principal, descripcion_final } = req.body;
    let info = await FeriasProfesiograficasInfo.findOne();
    
    if (!info) {
      info = await FeriasProfesiograficasInfo.create({
        titulo_principal: titulo_principal || 'Cursos de Ferias Profesiográficas',
        descripcion_final: descripcion_final || '¡Descubre nuestros cursos y potencia tu desarrollo profesional!'
      });
    } else {
      await info.update({ titulo_principal, descripcion_final });
    }
    
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la información', error });
  }
};

// --- CURSOS CONTROLLERS ---

export const getCursos = async (req: Request, res: Response) => {
  try {
    const cursos = await FeriasProfesiograficasCurso.findAll({
      order: [['orden', 'ASC']]
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos', error });
  }
};

export const getPublicCursos = async (req: Request, res: Response) => {
  try {
    const cursos = await FeriasProfesiograficasCurso.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']]
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos públicos', error });
  }
};

export const createCurso = async (req: Request, res: Response) => {
  try {
    const { titulo } = req.body;
    const imagenPath = (req as any).savedImagePath;

    if (!imagenPath) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    // Obtener el último orden para agregar al final
    const lastCurso = await FeriasProfesiograficasCurso.findOne({
      order: [['orden', 'DESC']]
    });
    const newOrder = lastCurso ? lastCurso.orden + 1 : 0;

    const newCurso = await FeriasProfesiograficasCurso.create({
      titulo: titulo || 'Sin título',
      imagen: imagenPath,
      orden: newOrder,
      activo: true
    });

    res.status(201).json(newCurso);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso', error });
  }
};

export const updateCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, activo } = req.body;
    const imagenPath = (req as any).savedImagePath;

    const curso = await FeriasProfesiograficasCurso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Si hay nueva imagen, eliminar la anterior
    if (imagenPath) {
      const oldImagePath = path.join(__dirname, '../../uploads', curso.imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      curso.imagen = imagenPath;
    }

    if (titulo !== undefined) curso.titulo = titulo;
    if (activo !== undefined) curso.activo = activo === 'true' || activo === true;

    await curso.save();
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso', error });
  }
};

export const deleteCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const curso = await FeriasProfesiograficasCurso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Eliminar imagen física
    const imagePath = path.join(__dirname, '../../uploads', curso.imagen);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await curso.destroy();
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso', error });
  }
};

export const toggleCursoStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const curso = await FeriasProfesiograficasCurso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    curso.activo = activo;
    await curso.save();
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado del curso', error });
  }
};

export const updateCursoOrder = async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body; // Array de IDs en el nuevo orden

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'Formato de datos inválido' });
    }

    // Actualizar el orden de cada curso
    const promises = orderedIds.map((id, index) => {
      return FeriasProfesiograficasCurso.update({ orden: index }, { where: { id } });
    });

    await Promise.all(promises);
    
    const cursos = await FeriasProfesiograficasCurso.findAll({
      order: [['orden', 'ASC']]
    });
    
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al reordenar los cursos', error });
  }
};

// --- VIDEOS CONTROLLERS ---

export const getVideos = async (req: Request, res: Response) => {
  try {
    const videos = await FeriasProfesiograficasVideo.findAll({
      order: [['orden', 'ASC']]
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los videos', error });
  }
};

export const getPublicVideos = async (req: Request, res: Response) => {
  try {
    const videos = await FeriasProfesiograficasVideo.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']]
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los videos públicos', error });
  }
};

export const createVideo = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, youtubeId } = req.body;

    if (!titulo || !descripcion || !youtubeId) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Obtener el último orden para agregar al final
    const lastVideo = await FeriasProfesiograficasVideo.findOne({
      order: [['orden', 'DESC']]
    });
    const newOrder = lastVideo ? lastVideo.orden + 1 : 0;

    const newVideo = await FeriasProfesiograficasVideo.create({
      titulo,
      descripcion,
      youtubeId,
      orden: newOrder,
      activo: true
    });

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el video', error });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, youtubeId, activo } = req.body;

    const video = await FeriasProfesiograficasVideo.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video no encontrado' });
    }

    if (titulo !== undefined) video.titulo = titulo;
    if (descripcion !== undefined) video.descripcion = descripcion;
    if (youtubeId !== undefined) video.youtubeId = youtubeId;
    if (activo !== undefined) video.activo = activo === 'true' || activo === true;

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el video', error });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await FeriasProfesiograficasVideo.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: 'Video no encontrado' });
    }

    await video.destroy();
    res.json({ message: 'Video eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el video', error });
  }
};

export const toggleVideoStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const video = await FeriasProfesiograficasVideo.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video no encontrado' });
    }

    video.activo = activo;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del video', error });
  }
};

// --- BANNERS (PÁGINA PRINCIPAL) CONTROLLERS ---

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await FeriasProfesiograficasBanner.findAll({
      order: [['orden', 'ASC']]
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los banners', error });
  }
};

export const getPublicBanners = async (req: Request, res: Response) => {
  try {
    const banners = await FeriasProfesiograficasBanner.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']]
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los banners públicos', error });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { titulo } = req.body;
    const imagenPath = (req as any).savedImagePath;

    if (!imagenPath) {
      return res.status(400).json({ message: 'La imagen es requerida para el banner' });
    }

    const lastBanner = await FeriasProfesiograficasBanner.findOne({
      order: [['orden', 'DESC']]
    });
    const newOrder = lastBanner ? lastBanner.orden + 1 : 0;

    const newBanner = await FeriasProfesiograficasBanner.create({
      titulo: titulo || 'Banner Ferias Profesiográficas',
      imagen: imagenPath,
      orden: newOrder,
      activo: true
    });

    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el banner', error });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, activo } = req.body;
    const imagenPath = (req as any).savedImagePath;

    const banner = await FeriasProfesiograficasBanner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner no encontrado' });
    }

    if (imagenPath) {
      const oldImagePath = path.join(__dirname, '../../uploads', banner.imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      banner.imagen = imagenPath;
    }

    if (titulo !== undefined) banner.titulo = titulo;
    if (activo !== undefined) banner.activo = activo === 'true' || activo === true;

    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el banner', error });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await FeriasProfesiograficasBanner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner no encontrado' });
    }

    const imagePath = path.join(__dirname, '../../uploads', banner.imagen);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await banner.destroy();
    res.json({ message: 'Banner eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el banner', error });
  }
};

export const toggleBannerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const banner = await FeriasProfesiograficasBanner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner no encontrado' });
    }

    banner.activo = activo;
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado del banner', error });
  }
};

export const updateBannerOrder = async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body; 

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'Formato de datos inválido' });
    }

    const promises = orderedIds.map((id, index) => {
      return FeriasProfesiograficasBanner.update({ orden: index }, { where: { id } });
    });

    await Promise.all(promises);
    
    const banners = await FeriasProfesiograficasBanner.findAll({
      order: [['orden', 'ASC']]
    });
    
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error al reordenar los banners', error });
  }
};
