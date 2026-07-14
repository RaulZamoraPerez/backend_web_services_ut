import { Request, Response, NextFunction } from 'express';
import Texto from '../models/Texto';
import { ValidationError, Op } from 'sequelize';

// Listar todos los textos con paginación
export const listarTextos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;

    const whereClause = search ? {
      contenido: {
        [Op.like]: `%${search}%`
      }
    } : {};

    const { count, rows } = await Texto.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      textos: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener texto por ID
export const obtenerTexto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const texto = await Texto.findByPk(id);
    
    if (!texto) {
      return res.status(404).json({ 
        error: 'Texto no encontrado',
        message: `No existe un texto con ID ${id}`
      });
    }
    
    res.json(texto);
  } catch (error) {
    next(error);
  }
};

// Crear nuevo texto
export const crearTexto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contenido } = req.body;
    
    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        message: 'El contenido es requerido'
      });
    }
    
    const nuevoTexto = await Texto.create({
      contenido: contenido.trim()
    });
    
    res.status(201).json({
      message: 'Texto creado exitosamente',
      texto: nuevoTexto
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Error de validación',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Actualizar texto
export const actualizarTexto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;
    
    if (!contenido || contenido.trim() === '') {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        message: 'El contenido es requerido'
      });
    }
    
    const texto = await Texto.findByPk(id);
    
    if (!texto) {
      return res.status(404).json({ 
        error: 'Texto no encontrado',
        message: `No existe un texto con ID ${id}`
      });
    }
    
    await texto.update({ contenido: contenido.trim() });
    
    res.json({
      message: 'Texto actualizado exitosamente',
      texto: texto
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Error de validación',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Eliminar texto
export const eliminarTexto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const texto = await Texto.findByPk(id);
    
    if (!texto) {
      return res.status(404).json({ 
        error: 'Texto no encontrado',
        message: `No existe un texto con ID ${id}`
      });
    }
    
    await texto.destroy();
    
    res.status(200).json({
      message: 'Texto eliminado exitosamente',
      id: parseInt(id)
    });
  } catch (error) {
    next(error);
  }
};

// Estadísticas de textos
export const estadisticasTextos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await Texto.count();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const textosHoy = await Texto.count({
      where: {
        createdAt: {
          [Op.gte]: hoy
        }
      }
    });
    
    const ultimoTexto = await Texto.findOne({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      totalTextos: total,
      textosHoy: textosHoy,
      ultimoTexto: ultimoTexto ? {
        id: ultimoTexto.id,
        contenido: ultimoTexto.contenido.substring(0, 100) + '...',
        createdAt: ultimoTexto.createdAt
      } : null
    });
  } catch (error) {
    next(error);
  }
};

// Mantener compatibilidad con nombres anteriores
export const listar = listarTextos;
export const obtener = obtenerTexto;
export const crear = crearTexto;
export const actualizar = actualizarTexto;
export const eliminar = eliminarTexto;