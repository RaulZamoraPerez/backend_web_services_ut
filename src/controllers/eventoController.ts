import { Request, Response } from 'express';
import Evento from '../models/Evento';
import { deleteFile } from '../middleware/uploadMiddleware';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export const getEventos = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const includePast = req.query.includePast === 'true';
    const whereClause: any = {};

    if (!includePast) {
      whereClause.fecha_evento = {
        [Op.gte]: new Date()
      };
    }

    if (!includeInactive) {
      whereClause.activo = true;
    }

    const eventos = await Evento.findAll({
      where: whereClause,
      order: [['fecha_evento', 'ASC']],
    });
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

export const getEventoActivo = async (req: Request, res: Response) => {
  try {
    const evento = await Evento.findOne({
      where: {
        activo: true,
        fecha_evento: {
          [Op.gte]: new Date()
        }
      },
      order: [['fecha_evento', 'ASC']],
    });

    if (!evento) {
      return res.status(404).json({ message: 'No hay eventos activos próximos' });
    }

    res.json(evento);
  } catch (error) {
    console.error('Error al obtener evento activo:', error);
    res.status(500).json({ error: 'Error al obtener evento activo' });
  }
};

export const createEvento = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, fecha_evento, tema, color, activo } = req.body;
    // Normalize optional fields: accept empty strings from client as "no value"
    const texto_boton = (req.body.texto_boton === '' ? null : req.body.texto_boton);
    const url_boton = (req.body.url_boton === '' ? null : req.body.url_boton);
    let imagen_fondo_url: string | null = null;

    // Use transaction to ensure single active event at a time
    const evento = await sequelize.transaction(async (t) => {
      const isActive = activo !== undefined ? (activo === 'true' || activo === true) : true;
      if (isActive) {
        // Deactivate all other events
        await Evento.update({ activo: false }, { where: {}, transaction: t });
      }

      if (req.file) {
        // Si se subió un archivo, usar la ruta relativa
        imagen_fondo_url = `/uploads/eventos/${req.file.filename}`;
      }

      const created = await Evento.create({
        titulo,
        descripcion,
        fecha_evento,
        tema: tema || 'general',
        color: color || '#FFD700',
        imagen_fondo_url: imagen_fondo_url || undefined,
        texto_boton: texto_boton || undefined,
        url_boton: url_boton || undefined,
        activo: isActive,
      }, { transaction: t });

      return created;
    });

    res.status(201).json(evento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

export const updateEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha_evento, tema, color, activo, texto_boton, url_boton, imagen_fondo_remove } = req.body;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    let imagen_fondo_url: string | null = evento.imagen_fondo_url ?? null;

    // If a new file is uploaded, delete the old one (if exists) and set the new path
    if (req.file) {
      if (evento.imagen_fondo_url) {
        try {
          const deleted = deleteFile(evento.imagen_fondo_url);
          if (process.env.NODE_ENV !== 'production') console.log(`[eventoController] deleted previous image: ${evento.imagen_fondo_url} => ${deleted}`);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') console.warn('[eventoController] failed deleting previous image', e);
        }
      }
      imagen_fondo_url = `/uploads/eventos/${req.file.filename}`;
    }

    // If client explicitly requested removal of existing image
    if (imagen_fondo_remove === 'true' || imagen_fondo_remove === true) {
      if (evento.imagen_fondo_url) {
        try {
          const deleted = deleteFile(evento.imagen_fondo_url);
          if (process.env.NODE_ENV !== 'production') console.log(`[eventoController] removed image by flag: ${evento.imagen_fondo_url} => ${deleted}`);
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') console.warn('[eventoController] failed deleting image by flag', e);
        }
      }
      imagen_fondo_url = null;
    }

    // Normalize empty strings to null (so DB stores NULL instead of '')
    const normalized_texto_boton = (texto_boton === '') ? null : (texto_boton !== undefined ? texto_boton : evento.texto_boton);
    const normalized_url_boton = (url_boton === '') ? null : (url_boton !== undefined ? url_boton : evento.url_boton);

    // Use transaction to atomically update active state and ensure only one active
    await sequelize.transaction(async (t) => {
      const settingActive = activo !== undefined ? (activo === 'true' || activo === true) : undefined;
      if (settingActive === true) {
        // Deactivate others
        await Evento.update({ activo: false }, { where: { id: { [Op.ne]: evento.id } }, transaction: t });
      }

      await evento.update({
        titulo,
        descripcion,
        fecha_evento,
        tema: tema !== undefined ? tema : evento.tema,
        color: color !== undefined ? color : evento.color,
        // Allow explicit null to clear image; when undefined leave as-is
        imagen_fondo_url: typeof imagen_fondo_url !== 'undefined' ? imagen_fondo_url : evento.imagen_fondo_url,
        texto_boton: normalized_texto_boton,
        url_boton: normalized_url_boton,
        activo: settingActive !== undefined ? settingActive : evento.activo
      }, { transaction: t });
    });

    res.json(evento);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
};

export const deleteEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Eliminar imagen de fondo asociada si existe
    if (evento.imagen_fondo_url) {
      try {
        const deleted = deleteFile(evento.imagen_fondo_url);
        if (process.env.NODE_ENV !== 'production') console.log(`[eventoController] deleted image on evento delete: ${evento.imagen_fondo_url} => ${deleted}`);
      } catch (e) {
        console.warn('[eventoController] failed deleting image on evento delete', e);
      }
    }

    await evento.destroy();
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};


