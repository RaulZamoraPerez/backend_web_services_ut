import { Request, Response, NextFunction } from 'express';
import FooterConfig from '../models/FooterConfig';
import Patrocinador from '../models/Patrocinador';
import { ValidationError, QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import fs from 'fs';
import path from 'path';

// --- FOOTER CONFIGURATION CONTROLLERS ---

export const getFooterConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let config = await FooterConfig.findOne();
    if (!config) {
      // Si por alguna razón no existe, crear el predeterminado
      config = await FooterConfig.create({});
    }

    let lastUpdate: Date | null = null;
    try {
      const dbName = sequelize.getDatabaseName();
      const result = await sequelize.query(
        `SELECT MAX(UPDATE_TIME) as last_update 
         FROM information_schema.tables 
         WHERE TABLE_SCHEMA = :dbName`,
        {
          replacements: { dbName },
          type: QueryTypes.SELECT
        }
      );
      if (result && result.length > 0) {
        const dateStr = (result[0] as any).last_update;
        if (dateStr) {
          lastUpdate = new Date(dateStr);
        }
      }
    } catch (queryErr) {
      console.warn('No se pudo consultar information_schema.tables, usando fecha del config:', queryErr);
    }

    if (!lastUpdate) {
      lastUpdate = (config as any).updatedAt || new Date();
    }

    return res.json({
      ...config.toJSON(),
      last_update: lastUpdate
    });
  } catch (error) {
    console.error('Error al obtener FooterConfig:', error);
    next(error);
  }
};

export const updateFooterConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { direccion, telefono, horario, email_rectoria, email_extension, mapa_url } = req.body;
    
    let config = await FooterConfig.findOne();
    if (!config) {
      config = await FooterConfig.create({});
    }

    await config.update({
      direccion: direccion !== undefined ? direccion : config.direccion,
      telefono: telefono !== undefined ? telefono : config.telefono,
      horario: horario !== undefined ? horario : config.horario,
      email_rectoria: email_rectoria !== undefined ? email_rectoria : config.email_rectoria,
      email_extension: email_extension !== undefined ? email_extension : config.email_extension,
      mapa_url: mapa_url !== undefined ? mapa_url : config.mapa_url
    });

    return res.json({
      message: 'Configuración de footer actualizada exitosamente',
      config
    });
  } catch (error) {
    console.error('Error al actualizar FooterConfig:', error);
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

// --- PATROCINADORES (SPONSORS CAROUSEL) CONTROLLERS ---

export const listPatrocinadores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patrocinadores = await Patrocinador.findAll({
      order: [['id', 'ASC']]
    });
    return res.json(patrocinadores);
  } catch (error) {
    console.error('Error al listar patrocinadores:', error);
    next(error);
  }
};

export const createPatrocinador = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, website } = req.body;
    const logo = (req as any).savedSponsorFile;

    if (!nombre || !website) {
      // Si se subió un logo temporalmente y hay error de campos obligatorios, limpiarlo
      if (logo) {
        const filePath = path.join(__dirname, '../../', logo);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(400).json({ error: 'Nombre y Website son campos requeridos' });
    }

    if (!logo) {
      return res.status(400).json({ error: 'Debe subir un archivo de logo' });
    }

    const patrocinador = await Patrocinador.create({
      nombre,
      website,
      logo
    });

    return res.status(201).json({
      message: 'Patrocinador creado exitosamente',
      patrocinador
    });
  } catch (error) {
    console.error('Error al crear patrocinador:', error);
    next(error);
  }
};

export const updatePatrocinador = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, website } = req.body;
    const logo = (req as any).savedSponsorFile;

    const patrocinador = await Patrocinador.findByPk(id);
    if (!patrocinador) {
      // Si se subió un logo pero no se encontró el modelo, borrar el archivo
      if (logo) {
        const filePath = path.join(__dirname, '../../', logo);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(404).json({ error: `Patrocinador con ID ${id} no encontrado` });
    }

    const oldLogo = patrocinador.logo;
    const updateData: any = {};

    if (nombre !== undefined) updateData.nombre = nombre;
    if (website !== undefined) updateData.website = website;
    if (logo) {
      updateData.logo = logo;
    }

    await patrocinador.update(updateData);

    // Si se subió un logo nuevo con éxito, borrar el archivo anterior si era una subida propia (comienza con 'uploads/')
    if (logo && oldLogo && oldLogo.startsWith('uploads/')) {
      const oldFilePath = path.join(__dirname, '../../', oldLogo);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log(`Archivo de logo antiguo eliminado: ${oldFilePath}`);
        }
      } catch (fileErr) {
        console.warn(`No se pudo eliminar el archivo físico antiguo: ${oldFilePath}`, fileErr);
      }
    }

    return res.json({
      message: 'Patrocinador actualizado exitosamente',
      patrocinador
    });
  } catch (error) {
    console.error('Error al actualizar patrocinador:', error);
    next(error);
  }
};

export const deletePatrocinador = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const patrocinador = await Patrocinador.findByPk(id);

    if (!patrocinador) {
      return res.status(404).json({ error: `Patrocinador con ID ${id} no encontrado` });
    }

    const logoPath = patrocinador.logo;

    await patrocinador.destroy();

    // Eliminar el archivo físico si es un recurso subido localmente (comienza con 'uploads/')
    if (logoPath && logoPath.startsWith('uploads/')) {
      const filePath = path.join(__dirname, '../../', logoPath);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Logo de patrocinador eliminado de disco: ${filePath}`);
        }
      } catch (fileErr) {
        console.warn(`No se pudo eliminar el archivo de logo: ${filePath}`, fileErr);
      }
    }

    return res.json({
      message: 'Patrocinador eliminado exitosamente',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error al eliminar patrocinador:', error);
    next(error);
  }
};
