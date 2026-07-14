import { Request, Response } from 'express';
import ProductoInvestigacion from '../models/ProductoInvestigacion';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getAllProductos = async (req: Request, res: Response) => {
  try {
    const productos = await ProductoInvestigacion.findAll({
      where: { activo: true },
      order: [['carpeta', 'DESC'], ['orden', 'ASC'], ['fecha_creacion', 'DESC']]
    });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos de investigación:', error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
};

export const createProducto = async (req: Request, res: Response) => {
  try {
    const { titulo, carpeta, orden } = req.body;
    const savedPdfPath = (req as any).savedPdfPath;

    if (!savedPdfPath) {
      return res.status(400).json({ message: 'El archivo PDF es requerido' });
    }

    if (!carpeta) {
        return res.status(400).json({ message: 'La carpeta es requerida' });
    }

    const nuevoProducto = await ProductoInvestigacion.create({
      titulo,
      pdf: savedPdfPath,
      carpeta,
      orden: orden ? parseInt(orden) : 0,
      activo: true
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto de investigación:', error);
    // Si hubo error y se subió archivo, intentar borrarlo
    if ((req as any).savedPdfPath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedPdfPath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al crear el registro' });
  }
};

export const updateProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, carpeta, orden, activo } = req.body;
    const savedPdfPath = (req as any).savedPdfPath;

    const producto = await ProductoInvestigacion.findByPk(id);

    if (!producto) {
      if (savedPdfPath) {
        const fullPath = path.join(__dirname, '../../uploads', savedPdfPath);
        deleteFile(fullPath);
      }
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Si hay nuevo PDF, borrar el anterior
    if (savedPdfPath && producto.pdf) {
      const oldPath = path.join(__dirname, '../../uploads', producto.pdf);
      deleteFile(oldPath);
    }

    await producto.update({
      titulo: titulo || producto.titulo,
      carpeta: carpeta || producto.carpeta,
      orden: orden !== undefined ? parseInt(orden) : producto.orden,
      activo: activo !== undefined ? activo === 'true' || activo === true : producto.activo,
      pdf: savedPdfPath || producto.pdf
    });

    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto de investigación:', error);
    if ((req as any).savedPdfPath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedPdfPath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al actualizar el registro' });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await ProductoInvestigacion.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Borrar archivo físico
    if (producto.pdf) {
      const fullPath = path.join(__dirname, '../../uploads', producto.pdf);
      deleteFile(fullPath);
    }

    await producto.destroy();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto de investigación:', error);
    res.status(500).json({ message: 'Error al eliminar el registro' });
  }
};
