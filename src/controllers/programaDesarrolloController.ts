import { Request, Response } from 'express';
import ProgramaDesarrollo from '../models/ProgramaDesarrollo';
import ProgramaDesarrolloCategory from '../models/ProgramaDesarrolloCategory';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getProgramas = async (req: Request, res: Response) => {
    try {
        const { admin } = req.query;
        // Si es admin o queremos vista por categorías (estilo Normatividad)
        const categories = await ProgramaDesarrolloCategory.findAll({
            include: [{
                model: ProgramaDesarrollo,
                as: 'programas',
                required: false,
                where: admin !== 'true' ? { activo: true } : {}
            }],
            order: [[{ model: ProgramaDesarrollo, as: 'programas' }, 'id', 'ASC']]
        });
        
        // Si no hay categorías pero hay programas huérfanos o simplemente queremos lista plana
        // O si simplemente queremos devolver las categorías aunque no tengan programas (required: false)
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programas', error });
    }
};


export const createCategory = async (req: Request, res: Response) => {
    try {
        const { titulo } = req.body;
        const categoria = await ProgramaDesarrolloCategory.create({ titulo });
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear categoría', error });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoria = await ProgramaDesarrolloCategory.findByPk(id, {
            include: [{ model: ProgramaDesarrollo, as: 'programas' }]
        });
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });

        // Eliminar archivos físicos
        const programas = (categoria as any).programas || [];
        for (const prog of programas) {
            if (prog.archivo) deleteFile(prog.archivo);
        }

        await categoria.destroy();
        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría', error });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo } = req.body;
        const categoria = await ProgramaDesarrolloCategory.findByPk(id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
        await categoria.update({ titulo });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar categoría', error });
    }
};


export const getProgramaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const programa = await ProgramaDesarrollo.findByPk(id);
        if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });
        res.json(programa);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programa', error });
    }
};

export const createPrograma = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, activo, categoria_id } = req.body;
        const archivo = req.file ? `/uploads/documentos/${req.file.filename}` : '';

        if (!archivo) {
            return res.status(400).json({ message: 'El archivo es requerido' });
        }

        const nuevoPrograma = await ProgramaDesarrollo.create({
            titulo,
            descripcion,
            archivo,
            activo: activo === 'true',
            categoria_id: categoria_id ? Number(categoria_id) : null
        });
        res.status(201).json(nuevoPrograma);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear programa', error });
    }
};

export const updatePrograma = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, activo, categoria_id } = req.body;
        const programa = await ProgramaDesarrollo.findByPk(id);

        if (!programa) {
            return res.status(404).json({ message: 'Programa no encontrado' });
        }

        const updateData: any = {};
        if (titulo !== undefined) updateData.titulo = titulo;
        if (descripcion !== undefined) updateData.descripcion = descripcion;
        if (activo !== undefined) {
            updateData.activo = activo === 'true' || activo === true;
        }
        if (categoria_id !== undefined) {
            updateData.categoria_id = (categoria_id === 'null' || categoria_id === null || categoria_id === '') ? null : Number(categoria_id);
        }

        if (req.file) {
            // Eliminar archivo anterior si existe
            if (programa.archivo) {
                deleteFile(programa.archivo);
            }
            updateData.archivo = `/uploads/documentos/${req.file.filename}`;
        }

        await programa.update(updateData);
        res.json(programa);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar programa', error });
    }
};


export const deletePrograma = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const programa = await ProgramaDesarrollo.findByPk(id);
        if (!programa) {
            return res.status(404).json({ message: 'Programa no encontrado' });
        }
        // Eliminar archivo físico si existe
        if (programa.archivo) {
            deleteFile(programa.archivo);
        }

        await programa.destroy();
        res.json({ message: 'Programa eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar programa', error });
    }
};
