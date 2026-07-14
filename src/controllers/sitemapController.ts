import { Request, Response } from 'express';
import SitemapCategory from '../models/SitemapCategory';

// GET /api/sitemap (Público)
export const getSitemap = async (req: Request, res: Response) => {
  try {
    const categories = await SitemapCategory.findAll({
      where: { active: true },
      order: [['order', 'ASC']],
    });
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching public sitemap:', error);
    res.status(500).json({ message: 'Error al obtener el mapa del sitio', error: error.message });
  }
};

// GET /api/sitemap/admin (Privado)
export const getAdminSitemap = async (req: Request, res: Response) => {
  try {
    const categories = await SitemapCategory.findAll({
      order: [['order', 'ASC']],
    });
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching admin sitemap:', error);
    res.status(500).json({ message: 'Error al obtener el mapa del sitio para administración', error: error.message });
  }
};

// POST /api/sitemap (Privado)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { title, icon, items, order, active } = req.body;
    
    if (!title || !icon) {
      return res.status(400).json({ message: 'El título y el ícono son obligatorios' });
    }

    const newCategory = await SitemapCategory.create({
      title,
      icon,
      items: items || [],
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ message: 'Categoría creada con éxito', data: newCategory });
  } catch (error: any) {
    console.error('Error creating sitemap category:', error);
    res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
  }
};

// PUT /api/sitemap/:id (Privado)
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, icon, items, order, active } = req.body;

    const category = await SitemapCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await category.update({
      title: title !== undefined ? title : category.title,
      icon: icon !== undefined ? icon : category.icon,
      items: items !== undefined ? items : category.items,
      order: order !== undefined ? order : category.order,
      active: active !== undefined ? active : category.active,
    });

    res.json({ message: 'Categoría actualizada con éxito', data: category });
  } catch (error: any) {
    console.error('Error updating sitemap category:', error);
    res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
  }
};

// DELETE /api/sitemap/:id (Privado)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await SitemapCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await category.destroy();
    res.json({ message: 'Categoría eliminada con éxito' });
  } catch (error: any) {
    console.error('Error deleting sitemap category:', error);
    res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
  }
};
