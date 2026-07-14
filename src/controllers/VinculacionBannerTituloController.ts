import { Request, Response } from 'express';
import sequelize from '../config/database';

export const getTitulo = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await sequelize.query('SELECT titulo FROM vinculacion_banner_titulo LIMIT 1');
    if (rows.length > 0) {
      res.json({ titulo: rows[0].titulo });
    } else {
      res.json({ titulo: 'Galería de Vinculación' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTitulo = async (req: Request, res: Response) => {
  try {
    const { titulo } = req.body;
    if (!titulo) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const [rows]: any = await sequelize.query('SELECT COUNT(*) as count FROM vinculacion_banner_titulo');
    
    if (rows[0].count === 0) {
      await sequelize.query('INSERT INTO vinculacion_banner_titulo (titulo) VALUES (?)', { replacements: [titulo] });
    } else {
      // Usamos un update sin where asumiendo que solo hay un registro
      await sequelize.query('UPDATE vinculacion_banner_titulo SET titulo = ?', { replacements: [titulo] });
    }
    
    res.json({ message: 'Título actualizado correctamente', titulo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
