import { Request, Response } from 'express';
import Carrera from '../models/Carrera';
import { CarreraConfig } from '../models/CarreraConfig';
import fs from 'fs/promises';
import path from 'path';

// Helper para resolver rutas, porque en la base de datos a veces se guarda como 'uploads/carreras/...'
// y a veces solo el nombre del archivo 'caratulas/archivo.jpg' o 'video.mp4'
const resolveFilePath = (basePath: string, filePath: string) => {
  if (filePath.startsWith('uploads/') || filePath.startsWith('\\uploads\\')) {
    return path.join(__dirname, '../../', filePath);
  }
  return path.join(basePath, filePath);
};

// GET - Obtener todas las carreras
export const getCarreras = async (req: Request, res: Response) => {
  try {
    const carreras = await Carrera.findAll({
      where: { activo: true },
      order: [['orden', 'ASC'], ['nivel', 'ASC']],
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ message: 'Error al obtener carreras' });
  }
};

// GET - Obtener todas las carreras (incluyendo inactivas) - Admin
export const getAllCarreras = async (req: Request, res: Response) => {
  try {
    const carreras = await Carrera.findAll({
      order: [['orden', 'ASC'], ['nivel', 'ASC']],
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ message: 'Error al obtener carreras' });
  }
};

// GET - Obtener carreras por nivel
export const getCarrerasByNivel = async (req: Request, res: Response) => {
  try {
    const { nivel } = req.params;
    const carreras = await Carrera.findAll({
      where: { 
        nivel,
        activo: true 
      },
      order: [['orden', 'ASC']],
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras por nivel:', error);
    res.status(500).json({ message: 'Error al obtener carreras por nivel' });
  }
};

// GET - Obtener una carrera por ID
export const getCarreraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.findByPk(id);
    
    if (!carrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    
    res.json(carrera);
  } catch (error) {
    console.error('Error al obtener carrera:', error);
    res.status(500).json({ message: 'Error al obtener carrera' });
  }
};

// POST - Crear nueva carrera
export const createCarrera = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      siglas,
      nivel,
      duracion,
      objetivo,
      perfil_ingreso,
      perfil_egreso,
      campo_laboral,
      competencias,
      atributos_egreso,
      objetivos_educacionales,
      mapa_curricular,
      orden,
      activo,
    } = req.body;

    const imagen = (req as any).savedImagePath || '';
    const imagen_portada = (req as any).savedPortadaPath || '';
    const video_url = (req as any).savedVideoPath || '';
    const plan_estudios_url = (req as any).savedPlanPath || '';

    let parsedMapaCurricular = null;
    if (mapa_curricular) {
      try {
        parsedMapaCurricular = typeof mapa_curricular === 'string' ? JSON.parse(mapa_curricular) : mapa_curricular;
      } catch (e) {
        console.error('Error parsing mapa_curricular:', e);
      }
    }

    // Asignar orden automáticamente como el máximo + 1 para evitar duplicados
    const maxOrden = (await Carrera.max('orden')) as number || 0;
    const nuevoOrden = maxOrden + 1;

    const carrera = await Carrera.create({
      nombre,
      siglas,
      nivel,
      duracion,
      objetivo,
      perfil_ingreso,
      perfil_egreso,
      campo_laboral,
      competencias,
      atributos_egreso,
      objetivos_educacionales,
      mapa_curricular: parsedMapaCurricular,
      imagen,
      imagen_portada,
      video_url,
      plan_estudios_url,
      orden: nuevoOrden,
      activo: activo === 'true' || activo === true,
    });

    res.status(201).json(carrera);
  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({ message: 'Error al crear carrera' });
  }
};

// PUT - Actualizar carrera
export const updateCarrera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.findByPk(id);

    if (!carrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    const {
      nombre,
      siglas,
      nivel,
      duracion,
      objetivo,
      perfil_ingreso,
      perfil_egreso,
      campo_laboral,
      competencias,
      atributos_egreso,
      objetivos_educacionales,
      mapa_curricular,
      orden,
      activo,
    } = req.body;

    // Actualizar imagen si se proporciona una nueva
    if ((req as any).savedImagePath) {
      // Eliminar imagen anterior si existe
      if (carrera.imagen) {
        const basePath = path.join(__dirname, '../../uploads/carreras');
        const oldImagePath = resolveFilePath(basePath, carrera.imagen);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error al eliminar imagen anterior:', error);
        }
      }
      carrera.imagen = (req as any).savedImagePath;
    }

    // Actualizar imagen portada si se proporciona una nueva
    if ((req as any).savedPortadaPath) {
      // Eliminar imagen anterior si existe
      if (carrera.imagen_portada) {
        const basePath = path.join(__dirname, '../../uploads/carreras');
        const oldPortadaPath = resolveFilePath(basePath, carrera.imagen_portada);
        try {
          await fs.unlink(oldPortadaPath);
        } catch (error) {
          console.error('Error al eliminar imagen portada anterior:', error);
        }
      }
      carrera.imagen_portada = (req as any).savedPortadaPath;
    }

    // Actualizar video si se proporciona uno nuevo
    if ((req as any).savedVideoPath) {
      // Eliminar video anterior si existe
      if (carrera.video_url) {
        const basePath = path.join(__dirname, '../../uploads/carreras/videos');
        const oldVideoPath = resolveFilePath(basePath, carrera.video_url);
        try {
          await fs.unlink(oldVideoPath);
        } catch (error) {
          console.error('Error al eliminar video anterior:', error);
        }
      }
      carrera.video_url = (req as any).savedVideoPath;
    }

    // Actualizar plan de estudios si se proporciona uno nuevo
    if ((req as any).savedPlanPath) {
      // Eliminar plan anterior si existe
      if (carrera.plan_estudios_url) {
        const basePath = path.join(__dirname, '../../uploads/carreras/planes');
        const oldPlanPath = resolveFilePath(basePath, carrera.plan_estudios_url);
        try {
          await fs.unlink(oldPlanPath);
        } catch (error) {
          console.error('Error al eliminar plan anterior:', error);
        }
      }
      carrera.plan_estudios_url = (req as any).savedPlanPath;
    }

    // Actualizar otros campos
    carrera.nombre = nombre || carrera.nombre;
    carrera.siglas = siglas || carrera.siglas;
    carrera.nivel = nivel || carrera.nivel;
    carrera.duracion = duracion || carrera.duracion;
    carrera.objetivo = objetivo || carrera.objetivo;
    carrera.perfil_ingreso = perfil_ingreso || carrera.perfil_ingreso;
    carrera.perfil_egreso = perfil_egreso || carrera.perfil_egreso;
    carrera.campo_laboral = campo_laboral || carrera.campo_laboral;
    carrera.competencias = competencias !== undefined ? competencias : carrera.competencias;
    carrera.atributos_egreso = atributos_egreso !== undefined ? atributos_egreso : carrera.atributos_egreso;
    carrera.objetivos_educacionales = objetivos_educacionales !== undefined ? objetivos_educacionales : carrera.objetivos_educacionales;
    
    if (mapa_curricular) {
      try {
        carrera.mapa_curricular = typeof mapa_curricular === 'string' ? JSON.parse(mapa_curricular) : mapa_curricular;
      } catch (e) {
        console.error('Error parsing mapa_curricular update:', e);
      }
    }

    carrera.orden = orden !== undefined ? parseInt(orden) : carrera.orden;
    carrera.activo = activo !== undefined ? (activo === 'true' || activo === true) : carrera.activo;

    await carrera.save();
    res.json(carrera);
  } catch (error) {
    console.error('Error al actualizar carrera:', error);
    res.status(500).json({ message: 'Error al actualizar carrera' });
  }
};

// DELETE - Eliminar carrera
export const deleteCarrera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.findByPk(id);

    if (!carrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    // Eliminar archivos asociados
    if (carrera.imagen) {
      const basePath = path.join(__dirname, '../../uploads/carreras');
      const imagePath = resolveFilePath(basePath, carrera.imagen);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
      }
    }

    if (carrera.imagen_portada) {
      const basePath = path.join(__dirname, '../../uploads/carreras');
      const portadaPath = resolveFilePath(basePath, carrera.imagen_portada);
      try {
        await fs.unlink(portadaPath);
      } catch (error) {
        console.error('Error al eliminar imagen portada:', error);
      }
    }

    if (carrera.video_url) {
      const basePath = path.join(__dirname, '../../uploads/carreras/videos');
      const videoPath = resolveFilePath(basePath, carrera.video_url);
      try {
        await fs.unlink(videoPath);
      } catch (error) {
        console.error('Error al eliminar video:', error);
      }
    }

    if (carrera.plan_estudios_url) {
      const basePath = path.join(__dirname, '../../uploads/carreras/planes');
      const planPath = resolveFilePath(basePath, carrera.plan_estudios_url);
      try {
        await fs.unlink(planPath);
      } catch (error) {
        console.error('Error al eliminar plan de estudios:', error);
      }
    }

    await carrera.destroy();
    res.json({ message: 'Carrera eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar carrera:', error);
    res.status(500).json({ message: 'Error al eliminar carrera' });
  }
};

// PUT - Actualizar orden de carreras
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orden } = req.body; // Array of { id, orden }

    if (!Array.isArray(orden)) {
      return res.status(400).json({ message: 'Formato inválido' });
    }

    // Actualizar cada carrera
    const promises = orden.map((item: { id: number; orden: number }) => 
      Carrera.update({ orden: item.orden }, { where: { id: item.id } })
    );

    await Promise.all(promises);

    // Recalcular órdenes consecutivos para asegurar unicidad
    const carreras = await Carrera.findAll({ order: [['orden', 'ASC']] });
    let currentOrder = 1;
    for (const carrera of carreras) {
      await carrera.update({ orden: currentOrder });
      currentOrder++;
    }

    res.json({ message: 'Orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ message: 'Error al actualizar orden' });
  }
};

// GET - Obtener configuración de cabeceras de carreras
export const getCarreraConfig = async (req: Request, res: Response) => {
  try {
    let config = await CarreraConfig.findOne();
    if (!config) {
      config = await CarreraConfig.create({});
    }
    res.json(config);
  } catch (error) {
    console.error('Error al obtener config de carreras:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT - Actualizar configuración de cabeceras de carreras
export const updateCarreraConfig = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion } = req.body;
    let config = await CarreraConfig.findOne();
    if (!config) {
      config = await CarreraConfig.create({});
    }
    config.titulo = titulo ?? config.titulo;
    config.descripcion = descripcion ?? config.descripcion;
    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Error al actualizar config de carreras:', error);
    res.status(500).json({ message: 'Error al actualizar config de carreras' });
  }
};
