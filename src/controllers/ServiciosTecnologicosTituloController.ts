import { Request, Response } from 'express';
import sequelize from '../config/database';

// Asegurarse de que la tabla exista
const initTable = async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS servicios_tecnologicos_titulo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [results]: any = await sequelize.query('SELECT COUNT(*) as count FROM servicios_tecnologicos_titulo');
    if (results[0].count === 0) {
      await sequelize.query('INSERT INTO servicios_tecnologicos_titulo (titulo) VALUES (?)', {
        replacements: ['Catálogo de Servicios Tecnológicos']
      });
    }
  } catch (error) {
    console.error('Error al inicializar tabla servicios_tecnologicos_titulo:', error);
  }
};

initTable();

export const getTitulo = async (req: Request, res: Response) => {
  try {
    const [results]: any = await sequelize.query('SELECT titulo FROM servicios_tecnologicos_titulo ORDER BY id DESC LIMIT 1');
    if (results.length > 0) {
      res.json({ titulo: results[0].titulo });
    } else {
      res.json({ titulo: 'Catálogo de Servicios Tecnológicos' });
    }
  } catch (error) {
    console.error('Error al obtener título:', error);
    res.status(500).json({ error: 'Error al obtener título' });
  }
};

export const updateTitulo = async (req: Request, res: Response) => {
  try {
    const { titulo } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const [results]: any = await sequelize.query('SELECT id FROM servicios_tecnologicos_titulo ORDER BY id DESC LIMIT 1');
    
    if (results.length > 0) {
      const id = results[0].id;
      await sequelize.query('UPDATE servicios_tecnologicos_titulo SET titulo = ? WHERE id = ?', {
        replacements: [titulo, id]
      });
    } else {
      await sequelize.query('INSERT INTO servicios_tecnologicos_titulo (titulo) VALUES (?)', {
        replacements: [titulo]
      });
    }

    res.json({ success: true, titulo });
  } catch (error) {
    console.error('Error al actualizar título:', error);
    res.status(500).json({ error: 'Error al actualizar título' });
  }
};
