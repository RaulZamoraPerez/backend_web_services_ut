import { Request, Response } from 'express';
import ModeloEducativo from '../models/ModeloEducativo';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getModeloEducativo = async (req: Request, res: Response) => {
  try {
    let modelo = await ModeloEducativo.findOne({ where: { activo: true } });
    
    if (!modelo) {
      // Create default if not exists
      modelo = await ModeloEducativo.create({
        titulo_principal: 'Modelos educativos',
        descripcion_principal: 'Conoce nuestro enfoque educativo diseñado para formar profesionistas competitivos.',
        titulo_seccion: 'Modelo Educativo',
        descripcion_seccion: 'El modelo educativo representa una evolución hacia la educación del futuro...',
          imagen_url: '/uploads/PE2025/MODELO EDUCATIVO.jpeg',
        caracteristicas: [
          {
            number: 1,
            title: "Educación híbrida y flexible",
            description: "Combinación de modalidades presenciales y virtuales con horarios adaptables.",
          },
          {
            number: 2,
            title: "Tecnologías emergentes",
            description: "Nuevas incorporaciones en pedagogías de enseñanza tecnológica.",
          },
          {
            number: 3,
            title: "Enfoque en sostenibilidad",
            description: "Formación con conciencia ambiental y responsabilidad social.",
          },
          {
            number: 4,
            title: "Internacionalización",
            description: "Programas de intercambio y colaboración con universidades extranjeras.",
          },
        ],
        activo: true
      });
    }

    res.json(modelo);
  } catch (error) {
    console.error('Error al obtener modelo educativo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateModeloEducativo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      titulo_principal, 
      descripcion_principal, 
      titulo_seccion, 
      descripcion_seccion, 
      imagen_url, 
      caracteristicas 
    } = req.body;

    const modelo = await ModeloEducativo.findByPk(id);

    if (!modelo) {
      return res.status(404).json({ message: 'Modelo educativo no encontrado' });
    }

    const updateFields: any = {
      titulo_principal,
      descripcion_principal,
      titulo_seccion,
      descripcion_seccion,
      imagen_url,
      caracteristicas
    };

    // If a file was uploaded via middleware, replace imagen_url with the saved path
    if ((req as any).savedImagePath || req.file) {
      if (modelo.imagen_url && modelo.imagen_url.startsWith('/uploads/modelo-educativo/')) {
        deleteFile(modelo.imagen_url.replace(/^\//, ''));
      }
      if ((req as any).savedImagePath) {
        updateFields.imagen_url = (req as any).savedImagePath;
      } else if (req.file) {
        updateFields.imagen_url = `/uploads/modelo-educativo/${req.file.filename}`;
      }
    }

    // Some clients POST `caracteristicas` as a JSON string when using FormData
    if (updateFields.caracteristicas && typeof updateFields.caracteristicas === 'string') {
      try {
        updateFields.caracteristicas = JSON.parse(updateFields.caracteristicas);
      } catch (err) {
        console.warn('Unable to parse caracteristicas JSON', err);
      }
    }

    await modelo.update(updateFields);

    res.json(modelo);
  } catch (error) {
    console.error('Error al actualizar modelo educativo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
