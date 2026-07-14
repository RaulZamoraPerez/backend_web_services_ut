import { Request, Response } from 'express';
import BibliotecaLink from '../models/BibliotecaLink';

export const getLinks = async (req: Request, res: Response): Promise<void> => {
  try {
    const links = await BibliotecaLink.findAll({
      order: [['order', 'ASC'], ['id', 'ASC']]
    });
    res.json(links);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching Biblioteca links', details: error.message });
  }
};

export const getLinkById = async (req: Request, res: Response): Promise<void> => {
  try {
    const link = await BibliotecaLink.findByPk(req.params.id);
    if (!link) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }
    res.json(link);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching Biblioteca link', details: error.message });
  }
};

export const createLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, url, icon, order, subtitle, spineColor, category } = req.body;
    const newLink = await BibliotecaLink.create({ 
      title, 
      description, 
      url, 
      icon, 
      order: order || 0,
      subtitle,
      spineColor,
      category
    });
    res.status(201).json(newLink);
  } catch (error: any) {
    res.status(500).json({ error: 'Error creating Biblioteca link', details: error.message });
  }
};

export const updateLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, url, icon, order, subtitle, spineColor, category } = req.body;
    const link = await BibliotecaLink.findByPk(req.params.id);
    if (!link) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }
    await link.update({ title, description, url, icon, order, subtitle, spineColor, category });
    res.json(link);
  } catch (error: any) {
    res.status(500).json({ error: 'Error updating Biblioteca link', details: error.message });
  }
};

export const deleteLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const link = await BibliotecaLink.findByPk(req.params.id);
    if (!link) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }
    await link.destroy();
    res.json({ message: 'Link deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Error deleting Biblioteca link', details: error.message });
  }
};
