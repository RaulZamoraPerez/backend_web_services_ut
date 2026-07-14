import Calendario from "../models/Calendario";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import fs from 'fs';
import path from 'path';

export const getAllCalendarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calendarios = await Calendario.findAll({
      order: [['fechaSubida', 'DESC']]
    });
    res.status(200).json({
      message: "Calendarios obtenidos correctamente",
      data: calendarios
    });
  } catch (error) {
    console.error('Error al obtener calendarios:', error);
    next(error);
  }
};

export const getCalendarioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const calendario = await Calendario.findByPk(id);

    if (!calendario) {
      return res.status(404).json({ message: "Calendario no encontrado" });
    }

    res.status(200).json({
      message: "Calendario encontrado",
      data: calendario
    });
  } catch (error) {
    console.error('Error al obtener calendario:', error);
    next(error);
  }
};

export const createCalendario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo, descripcion } = req.body;
    const archivo = req.file ? req.file.filename : undefined;

    // Validar campos requeridos
    if (!titulo || !archivo) {
      return res.status(400).json({ error: "Título y archivo son requeridos" });
    }

    const nuevoCalendario = await Calendario.create({
      titulo,
      descripcion,
      archivo,
      fechaSubida: new Date()
    });

    res.status(201).json({
      message: "Calendario creado correctamente",
      data: nuevoCalendario
    });
  } catch (error) {
    console.error('Error al crear calendario:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    next(error);
  }
};

export const updateCalendario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const archivo = req.file ? req.file.filename : undefined;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const calendario = await Calendario.findByPk(id);
    if (!calendario) {
      return res.status(404).json({ message: "Calendario no encontrado" });
    }

    // Si hay nuevo archivo, eliminar el anterior
    if (archivo && calendario.archivo) {
      const uploadDir = path.resolve(process.cwd(), 'uploads/calendarios');
      const oldPath = path.join(uploadDir, calendario.archivo);
      
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.error('Error al eliminar archivo físico anterior:', err);
        // Continuamos aunque falle el borrado del archivo viejo
      }
    }

    await calendario.update({
      titulo: titulo || calendario.titulo,
      descripcion: descripcion !== undefined ? descripcion : calendario.descripcion,
      archivo: archivo || calendario.archivo
    });

    res.status(200).json({
      message: "Calendario actualizado correctamente",
      data: calendario
    });
  } catch (error) {
    console.error('Error al actualizar calendario:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    next(error);
  }
};

export const deleteCalendario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const calendario = await Calendario.findByPk(id);
    if (!calendario) {
      return res.status(404).json({ message: "Calendario no encontrado" });
    }

    // Eliminar archivo físico
    if (calendario.archivo) {
      const uploadDir = path.resolve(process.cwd(), 'uploads/calendarios');
      const filePath = path.join(uploadDir, calendario.archivo);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error al eliminar archivo físico:', err);
        // Continuamos eliminando el registro en la BD
      }
    }

    await calendario.destroy();

    res.status(200).json({
      message: "Calendario eliminado correctamente"
    });
  } catch (error) {
    console.error('Error al eliminar calendario:', error);
    next(error);
  }
};