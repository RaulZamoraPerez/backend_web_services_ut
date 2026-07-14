import Formulario from "../models/Formulario";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { deleteFile } from "../middleware/uploadMiddleware";
import path from "path";

export const getAllFormularios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formularios = await Formulario.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      message: "Formularios obtenidos correctamente",
      data: formularios
    });
  } catch (error) {
    console.error('Error al obtener formularios:', error);
    next(error);
  }
};

export const getFormularioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const formulario = await Formulario.findByPk(id);
    
    if (!formulario) {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }

    res.status(200).json({
      message: "Formulario encontrado",
      data: formulario
    });
  } catch (error) {
    console.error('Error al obtener formulario:', error);
    next(error);
  }
};

export const crearFormulario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo, descripcion, campos } = req.body;
    let archivo = req.file ? req.file.filename : undefined;

    // Validar campos requeridos
    if (!titulo) {
      return res.status(400).json({ error: "El título es requerido" });
    }

    // Procesar campos del formulario si vienen como string
    let camposFormulario;
    try {
      camposFormulario = typeof campos === 'string' ? JSON.parse(campos) : campos || [];
    } catch (error) {
      return res.status(400).json({ error: "Formato de campos inválido" });
    }

    const contenidoFormulario = {
      titulo,
      descripcion: descripcion || '',
      campos: camposFormulario,
      archivo
    };

    const nuevoFormulario = await Formulario.create({ 
      contenido: contenidoFormulario 
    });

    res.status(201).json({
      message: "Formulario creado correctamente",
      data: nuevoFormulario
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: "Error de validación",
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    console.error('Error al crear formulario:', error);
    next(error);
  }
};

export const updateFormularioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, campos } = req.body;
    let archivo = req.file ? req.file.filename : undefined;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Validar campos requeridos
    if (!titulo) {
      return res.status(400).json({ error: "El título es requerido" });
    }

    // Buscar el formulario existente
    const formulario = await Formulario.findByPk(id);
    if (!formulario) {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }

    // Procesar campos del formulario
    let camposFormulario;
    try {
      camposFormulario = typeof campos === 'string' ? JSON.parse(campos) : campos || [];
    } catch (error) {
      return res.status(400).json({ error: "Formato de campos inválido" });
    }

    // Preparar contenido actualizado
    const contenidoActualizado = {
      titulo,
      descripcion: descripcion || '',
      campos: camposFormulario,
      archivo: archivo || formulario.contenido.archivo
    };

    // Solo actualizar imagen/archivo si se proporciona una nueva
    if (req.file) {
      if (formulario.contenido && formulario.contenido.archivo) {
        const oldFilePath = path.join('uploads/directorios', formulario.contenido.archivo);
        deleteFile(oldFilePath);
      }
    }

    // Actualizar formulario
    await formulario.update({ contenido: contenidoActualizado });

    res.status(200).json({
      message: "Formulario actualizado correctamente",
      data: formulario
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: "Error de validación",
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    console.error('Error al actualizar formulario:', error);
    next(error);
  }
};

export const deleteFormularioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar el formulario existente
    const formulario = await Formulario.findByPk(id);
    if (!formulario) {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }

    // Eliminar archivo físico si existe
    if (formulario.contenido && formulario.contenido.archivo) {
      const filePath = path.join('uploads/directorios', formulario.contenido.archivo);
      deleteFile(filePath);
    }

    // Eliminar formulario
    await formulario.destroy();

    res.status(200).json({
      message: "Formulario eliminado correctamente",
      data: { id: formulario.id }
    });
  } catch (error) {
    console.error('Error al eliminar formulario:', error);
    next(error);
  }
};
