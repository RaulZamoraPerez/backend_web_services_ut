import { Request, Response, NextFunction } from "express";
import { Area, Categorias, Archivos } from "../models/associations";
import DocumentosService from "../services/documentosService";
import { deleteFile } from "../middleware/uploadMiddleware";
import path from "path";

// ============================================
// CONTROLADORES PARA ÁREAS
// ============================================

export const obtenerAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const areas = await DocumentosService.getCompleteStructure();
    if (!areas || areas.length === 0) {
      return res.status(200).json([]);
    }
    res.json(areas);
  } catch (error) {
    next(error);
  }
};

export const obtenerAreaPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const area = await DocumentosService.getAreaById(Number(id));

    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    res.json(area);
  } catch (error) {
    next(error);
  }
};

export const crearArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Nombre } = req.body;

    if (!Nombre || Nombre.trim() === '') {
      return res.status(400).json({ message: "El nombre del área es requerido" });
    }

    const nuevaArea = await DocumentosService.createArea(Nombre);
    res.status(201).json(nuevaArea);
  } catch (error) {
    next(error);
  }
};

export const actualizarArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { Nombre } = req.body;

    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    await area.update({ Nombre });
    res.json(area);
  } catch (error) {
    next(error);
  }
};

export const eliminarArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const area = await Area.findByPk(id);

    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    await area.destroy();
    res.json({ message: "Área eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CONTROLADORES PARA CATEGORÍAS
// ============================================

export const obtenerCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorias = await Categorias.findAll({
      include: [
        { model: Area, as: 'area' },
        { model: Archivos, as: 'archivos' }
      ]
    });

    if (!categorias || categorias.length === 0) {
      return res.status(200).json([]);
    }

    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

export const obtenerCategoriaPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const categoria = await DocumentosService.getCategoryWithFiles(Number(id));

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

export const crearCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Nombre, ID_Area } = req.body;

    if (!Nombre || Nombre.trim() === '') {
      return res.status(400).json({ message: "El nombre de la categoría es requerido" });
    }

    if (!ID_Area) {
      return res.status(400).json({ message: "El ID del área es requerido" });
    }

    const nuevaCategoria = await DocumentosService.createCategory(Nombre.trim(), ID_Area);
    res.status(201).json(nuevaCategoria);
  } catch (error: any) {
    // Manejar errores específicos
    if (error.status === 409) {
      return res.status(409).json({
        message: error.message || "Ya existe una categoría con ese nombre en esta área"
      });
    }
    next(error);
  }
};

export const actualizarCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { Nombre, ID_Area } = req.body;

    const categoria = await Categorias.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoria.update({ Nombre, ID_Area });
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

export const eliminarCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const categoria = await Categorias.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Buscar todos los archivos asociados a esta categoría
    const archivos = await Archivos.findAll({ where: { ID_Categorias: id } });

    // Eliminar cada archivo físico y luego de la BD
    for (const archivo of archivos) {
      if (archivo.Ruta_Documento) {
        const filePath = path.join(__dirname, '../../', archivo.Ruta_Documento);
        deleteFile(filePath);
      }
      await archivo.destroy();
    }

    // Ahora sí, eliminar la categoría
    await categoria.destroy();
    res.json({ message: "Categoría y sus archivos eliminados correctamente" });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CONTROLADORES PARA ARCHIVOS
// ============================================

export const obtenerArchivos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const archivos = await Archivos.findAll({
      include: [
        {
          model: Categorias,
          as: 'categoria',
          include: [{ model: Area, as: 'area' }]
        }
      ]
    });

    if (!archivos || archivos.length === 0) {
      return res.status(200).json([]);
    }

    res.json(archivos);
  } catch (error) {
    next(error);
  }
};

export const obtenerArchivoPorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const archivo = await DocumentosService.getFileWithHierarchy(Number(id));

    if (!archivo) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    res.json(archivo);
  } catch (error) {
    next(error);
  }
};

export const obtenerArchivosPorArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { areaId } = req.params;
    const archivos = await DocumentosService.getFilesByArea(Number(areaId));

    if (!archivos || archivos.length === 0) {
      return res.status(200).json([]);
    }

    res.json(archivos);
  } catch (error) {
    next(error);
  }
};

export const crearArchivo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Nombre, Descripcion, Ruta_Documento, ID_Categorias } = req.body;

    if (!Nombre || Nombre.trim() === '') {
      return res.status(400).json({ message: "El nombre del archivo es requerido" });
    }

    if (!Ruta_Documento || Ruta_Documento.trim() === '') {
      return res.status(400).json({ message: "La ruta del documento es requerida" });
    }

    if (!ID_Categorias) {
      return res.status(400).json({ message: "El ID de la categoría es requerido" });
    }

    const nuevoArchivo = await DocumentosService.createFile({
      Nombre,
      Descripcion,
      Ruta_Documento,
      ID_Categorias
    });

    res.status(201).json(nuevoArchivo);
  } catch (error) {
    next(error);
  }
};

export const subirArchivo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Nombre, Descripcion, Ruta_Documento, ID_Categorias } = req.body;

    if (!ID_Categorias) {
      // Si hay un archivo subido, eliminarlo
      if (req.file) {
        const filePath = path.join(__dirname, '../../', req.file.path);
        deleteFile(filePath);
      }
      return res.status(400).json({ message: "El ID de la categoría es requerido" });
    }

    // Validar que la categoría existe
    const categoria = await Categorias.findByPk(ID_Categorias);
    if (!categoria) {
      // Eliminar archivo subido si la categoría no existe
      if (req.file) {
        const filePath = path.join(__dirname, '../../', req.file.path);
        deleteFile(filePath);
      }
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // If file is an image, ensure the category belongs to Promoción area (ID 10)
    if (req.file && req.file.mimetype && req.file.mimetype.startsWith('image/')) {
      if (categoria.ID_Area !== 10) {
        // Delete uploaded file
        const filePath = path.join(__dirname, '../../', req.file.path);
        deleteFile(filePath);
        return res.status(400).json({ message: 'Imágenes solo permitidas para la categoría de Promoción Institucional' });
      }
    }

    // El middleware ya agregó Ruta_Documento y Nombre al body
    const nuevoArchivo = await DocumentosService.createFile({
      Nombre: Nombre || req.file?.originalname || 'documento',
      Descripcion: Descripcion || null,
      Ruta_Documento,
      ID_Categorias: Number(ID_Categorias)
    });

    res.status(201).json({
      message: "Archivo subido exitosamente",
      archivo: nuevoArchivo,
      file: {
        originalname: req.file?.originalname,
        filename: req.file?.filename,
        mimetype: req.file?.mimetype,
        size: req.file?.size,
        path: Ruta_Documento
      }
    });
  } catch (error) {
    // Si hay error, eliminar el archivo subido
    if (req.file) {
      const filePath = path.join(__dirname, '../../', req.file.path);
      deleteFile(filePath);
    }
    next(error);
  }
};

export const actualizarArchivo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion, Ruta_Documento, ID_Categorias } = req.body;

    const archivo = await Archivos.findByPk(id);
    if (!archivo) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    if (Ruta_Documento && Ruta_Documento !== archivo.Ruta_Documento) {
      if (archivo.Ruta_Documento) {
        const oldFilePath = path.join(__dirname, '../../', archivo.Ruta_Documento);
        deleteFile(oldFilePath);
      }
    }

    await archivo.update({
      Nombre,
      Descripcion,
      Ruta_Documento,
      ID_Categorias
    });

    res.json(archivo);
  } catch (error) {
    next(error);
  }
};

export const eliminarArchivo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const archivo = await Archivos.findByPk(id);

    if (!archivo) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    // Intentar eliminar el archivo físico si existe
    if (archivo.Ruta_Documento) {
      const filePath = path.join(__dirname, '../../', archivo.Ruta_Documento);
      const deleted = deleteFile(filePath);

      if (deleted) {
        console.log(`✅ Archivo físico eliminado: ${archivo.Ruta_Documento}`);
      } else {
        console.warn(`⚠️  No se pudo eliminar el archivo físico: ${archivo.Ruta_Documento}`);
      }
    }

    await archivo.destroy();
    res.json({ message: "Archivo eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CONTROLADORES PARA ESTADÍSTICAS
// ============================================

export const obtenerEstadisticas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await DocumentosService.getStatsPerArea();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};