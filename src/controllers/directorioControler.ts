import Directorios from "../models/Directorios";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { deleteFile } from "../middleware/uploadMiddleware";
import path from "path";

export const getAllDirectorios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const directorios = await Directorios.findAll({
      order: [
        ['orden', 'ASC'],
        ['titulo', 'ASC']
      ]
    });
    res.status(200).json({
      message: "Directorios obtenidos correctamente",
      data: directorios
    });
  } catch (error) {
    console.error('Error al obtener directorios:', error);
    next(error);
  }
};

export const getDirectorioById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const directorio = await Directorios.findByPk(id);

    if (!directorio) {
      return res.status(404).json({ message: "Directorio no encontrado" });
    }

    res.status(200).json({
      message: "Directorio encontrado",
      data: directorio
    });
  } catch (error) {
    console.error('Error al obtener directorio:', error);
    next(error);
  }
};

export const createDirectorio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo, nombre, telefono, extension, correo, activo, orden } = req.body;
    let imagen = req.file ? req.file.filename : undefined;

    // Validar campos requeridos
    if (!titulo || !nombre) {
      return res.status(400).json({ error: "Título y nombre son campos requeridos" });
    }

    // Crear nuevo directorio
    const nuevoDirectorio = await Directorios.create({
      titulo,
      nombre,
      telefono,
      extension,
      correo,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : true,
      orden: orden !== undefined ? Number(orden) : 0,
      imagen
    });

    res.status(201).json({
      message: "Directorio creado correctamente",
      data: nuevoDirectorio
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
    console.error('Error al crear directorio:', error);
    next(error);
  }
};
export const updateDirectorio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { titulo, nombre, telefono, extension, correo, activo, orden } = req.body;
    let imagen = req.file ? req.file.filename : undefined;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Validar campos requeridos
    if (!titulo || !nombre) {
      return res.status(400).json({ error: "Título y nombre son campos requeridos" });
    }

    // Buscar el directorio existente
    const directorioExistente = await Directorios.findByPk(id);
    if (!directorioExistente) {
      return res.status(404).json({ message: "Directorio no encontrado" });
    }

    // Preparar datos de actualización
    const datosActualizacion: any = {
      titulo,
      nombre,
      telefono,
      extension,
      correo
    };
    if (activo !== undefined) {
      datosActualizacion.activo = (activo === 'true' || activo === true);
    }
    if (orden !== undefined) {
      datosActualizacion.orden = Number(orden);
    }

    // Solo actualizar imagen si se proporciona una nueva
    if (imagen) {
      // Eliminar imagen anterior si existe
      if (directorioExistente.imagen) {
        const oldImagePath = path.join('uploads/directorios', directorioExistente.imagen);
        deleteFile(oldImagePath);
      }
      datosActualizacion.imagen = imagen;
    }

    // Actualizar directorio
    await directorioExistente.update(datosActualizacion);

    res.status(200).json({
      message: "Directorio actualizado correctamente",
      data: directorioExistente
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
    console.error('Error al actualizar directorio:', error);
    next(error);
  }
};
export const deleteDirectorio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar el directorio existente
    const directorioExistente = await Directorios.findByPk(id);
    if (!directorioExistente) {
      return res.status(404).json({ message: "Directorio no encontrado" });
    }

    // Eliminar imagen física si existe
    if (directorioExistente.imagen) {
      const imagePath = path.join('uploads/directorios', directorioExistente.imagen);
      deleteFile(imagePath);
    }

    // Eliminar directorio de la BD
    await directorioExistente.destroy();

    res.status(200).json({
      message: "Directorio eliminado correctamente",
      data: { id: directorioExistente.id }
    });
  } catch (error) {
    console.error('Error al eliminar directorio:', error);
    next(error);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "Formato de datos inválido. Se esperaba un array de { id, orden }." });
    }
    
    const promesas = ids.map((item: any) => 
      Directorios.update({ orden: item.orden }, { where: { id: item.id } })
    );
    
    await Promise.all(promesas);
    
    res.status(200).json({
      message: "Orden actualizado correctamente"
    });
  } catch (error) {
    console.error('Error al actualizar el orden:', error);
    next(error);
  }
};