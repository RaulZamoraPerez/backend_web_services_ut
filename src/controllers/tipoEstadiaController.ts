import { Request, Response } from 'express';
import TipoEstadia from '../models/TipoEstadia';
import EstadiaDocumento from '../models/EstadiaDocumento';

// Listar todos los tipos (públicos y privados)
export const listarTipos = async (req: Request, res: Response) => {
  try {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const where = incluirInactivos ? {} : { Activo: true };
    
    const tipos = await TipoEstadia.findAll({
      where,
      order: [['Orden', 'ASC'], ['Nombre', 'ASC']],
    });
    
    res.json(tipos);
  } catch (error) {
    console.error('Error al listar tipos de estadía:', error);
    res.status(500).json({ error: 'Error al listar tipos de estadía' });
  }
};

// Obtener un tipo por ID
export const obtenerTipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tipo = await TipoEstadia.findByPk(id);
    
    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de estadía no encontrado' });
    }
    
    res.json(tipo);
  } catch (error) {
    console.error('Error al obtener tipo de estadía:', error);
    res.status(500).json({ error: 'Error al obtener tipo de estadía' });
  }
};

// Crear nuevo tipo
export const crearTipo = async (req: Request, res: Response) => {
  try {
    const { Nombre, Descripcion, Orden } = req.body;
    
    if (!Nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    // Verificar si ya existe
    const existente = await TipoEstadia.findOne({ where: { Nombre } });
    if (existente) {
      return res.status(400).json({ error: 'Ya existe un tipo con ese nombre' });
    }
    
    const tipo = await TipoEstadia.create({
      Nombre,
      Descripcion,
      Orden: Orden || 0,
      Activo: true,
    });
    
    res.status(201).json(tipo);
  } catch (error) {
    console.error('Error al crear tipo de estadía:', error);
    res.status(500).json({ error: 'Error al crear tipo de estadía' });
  }
};

// Actualizar tipo
export const actualizarTipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Orden, Activo } = req.body;
    
    const tipo = await TipoEstadia.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de estadía no encontrado' });
    }
    
    const oldName = tipo.Nombre;
    const newName = Nombre ? Nombre.trim() : oldName;

    // Si se cambia el nombre, verificar que no exista otro con ese nombre
    if (newName !== oldName) {
      const existente = await TipoEstadia.findOne({ where: { Nombre: newName } });
      if (existente) {
        return res.status(400).json({ error: 'Ya existe un tipo con ese nombre' });
      }
    }
    
    await tipo.update({
      Nombre: newName,
      Descripcion: Descripcion !== undefined ? Descripcion : tipo.Descripcion,
      Orden: Orden !== undefined ? Orden : tipo.Orden,
      Activo: Activo !== undefined ? Activo : tipo.Activo,
    });
    
    res.json(tipo);
  } catch (error) {
    console.error('Error al actualizar tipo de estadía:', error);
    res.status(500).json({ error: 'Error al actualizar tipo de estadía' });
  }
};

// Eliminar tipo
export const eliminarTipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const tipo = await TipoEstadia.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de estadía no encontrado' });
    }
    
    await tipo.destroy();
    
    res.json({ mensaje: 'Tipo de estadía eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tipo de estadía:', error);
    res.status(500).json({ error: 'Error al eliminar tipo de estadía' });
  }
};

// Reordenar tipos
export const reordenarTipos = async (req: Request, res: Response) => {
  try {
    const { tipos } = req.body; // Array de { ID, Orden }
    
    if (!Array.isArray(tipos)) {
      return res.status(400).json({ error: 'Se esperaba un array de tipos' });
    }
    
    await Promise.all(
      tipos.map(({ ID, Orden }) =>
        TipoEstadia.update({ Orden }, { where: { ID } })
      )
    );
    
    res.json({ mensaje: 'Orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al reordenar tipos:', error);
    res.status(500).json({ error: 'Error al reordenar tipos' });
  }
};
