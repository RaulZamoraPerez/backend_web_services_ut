import { Request, Response } from 'express';
import Countdown from '../models/Countdown';

// Obtener el único evento de cuenta regresiva (asumimos que solo hay uno activo o principal)
export const getCountdown = async (req: Request, res: Response): Promise<void> => {
  try {
    // Buscamos el primero que haya, ya que será configurado desde el dashboard. 
    // Si queremos soportar múltiples en el futuro podríamos buscar todos, pero el caso de uso es uno principal.
    let countdown = await Countdown.findOne();

    res.json(countdown);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Un error desconocido ocurrió al obtener la cuenta regresiva' });
    }
  }
};

// Actualizar la cuenta regresiva
export const updateCountdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, subtitulo, descripcion, fecha_objetivo, is_active, efecto, texto_finalizado, tagline_finalizado } = req.body;

    let countdown = await Countdown.findOne();

    if (!countdown) {
      countdown = await Countdown.create({
        titulo,
        subtitulo,
        descripcion,
        fecha_objetivo,
        is_active,
        efecto,
        texto_finalizado,
        tagline_finalizado
      });
    } else {
      countdown.titulo = titulo;
      countdown.subtitulo = subtitulo;
      countdown.descripcion = descripcion;
      countdown.fecha_objetivo = fecha_objetivo;
      countdown.is_active = is_active;
      countdown.efecto = efecto || countdown.efecto;
      countdown.texto_finalizado = texto_finalizado;
      countdown.tagline_finalizado = tagline_finalizado;
      await countdown.save();
    }

    res.json(countdown);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Un error desconocido ocurrió al actualizar la cuenta regresiva' });
    }
  }
};

// Eliminar la cuenta regresiva
export const deleteCountdown = async (req: Request, res: Response): Promise<void> => {
  try {
    await Countdown.destroy({ where: {} });
    res.json({ message: 'Cuenta regresiva eliminada exitosamente' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Un error desconocido ocurrió al eliminar la cuenta regresiva' });
    }
  }
};

