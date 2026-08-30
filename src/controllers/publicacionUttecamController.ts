import { Request, Response } from 'express';
import { Op } from 'sequelize';
import PublicacionUttecam from '../models/PublicacionUttecam';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

/**
 * Obtener publicaciones activas para el portal público
 */
export const getPublicaciones = async (req: Request, res: Response) => {
  try {
    const { search, categoria } = req.query;
    const whereCondition: any = { activo: true };

    if (categoria && categoria !== 'Todas' && categoria !== 'Todos') {
      whereCondition.categoria = categoria;
    }

    if (search) {
      whereCondition[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { autor: { [Op.like]: `%${search}%` } },
        { editorial: { [Op.like]: `%${search}%` } },
        { materia: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
        { edicion: { [Op.like]: `%${search}%` } },
        { isbn: { [Op.like]: `%${search}%` } },
        { print_isbn: { [Op.like]: `%${search}%` } },
        { e_isbn: { [Op.like]: `%${search}%` } },
      ];
    }

    const publicaciones = await PublicacionUttecam.findAll({
      where: whereCondition,
      order: [
        ['orden', 'ASC'],
        ['id', 'DESC'],
      ],
    });

    return res.json(publicaciones);
  } catch (error: any) {
    console.error('Error al obtener publicaciones:', error);
    return res.status(500).json({ error: 'Error al obtener las publicaciones UTTECAM' });
  }
};

/**
 * Obtener todas las publicaciones para el Dashboard (Admin)
 */
export const getPublicacionesAdmin = async (req: Request, res: Response) => {
  try {
    const publicaciones = await PublicacionUttecam.findAll({
      order: [
        ['orden', 'ASC'],
        ['id', 'DESC'],
      ],
    });

    return res.json(publicaciones);
  } catch (error: any) {
    console.error('Error al obtener publicaciones admin:', error);
    return res.status(500).json({ error: 'Error al obtener las publicaciones para administración' });
  }
};

/**
 * Obtener detalle de una publicación por ID
 */
export const getPublicacionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await PublicacionUttecam.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    return res.json(publicacion);
  } catch (error: any) {
    console.error('Error al obtener detalle de publicación:', error);
    return res.status(500).json({ error: 'Error al consultar la publicación' });
  }
};

/**
 * Crear nueva publicación con metadatos completos eLibro
 */
export const createPublicacion = async (req: Request, res: Response) => {
  try {
    const {
      titulo,
      edicion,
      autor,
      descripcion,
      categoria,
      paginas,
      isbn,
      print_isbn,
      e_isbn,
      editorial,
      idioma,
      materia,
      volumen,
      paginas_impresion,
      paginas_copia,
      audio_disponible,
      tipo_acceso,
      limite_descargas_dia,
      limite_descargas_mes,
      tabla_contenidos,
      fecha_publicacion,
      permitir_descarga,
      orden,
      activo,
    } = req.body;

    const savedPortadaPath = (req as any).savedPortadaPath || req.body.portada || null;
    const savedPdfPath = (req as any).savedPdfPath || req.body.pdf || null;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }

    if (!savedPdfPath) {
      return res.status(400).json({ error: 'El archivo PDF del libro es obligatorio' });
    }

    const nuevaPublicacion = await PublicacionUttecam.create({
      titulo: titulo.trim(),
      edicion: edicion ? edicion.trim() : '1ª Edición',
      autor: autor ? autor.trim() : 'UTTECAM',
      descripcion: descripcion ? descripcion.trim() : '',
      categoria: categoria ? categoria.trim() : 'Libro',
      portada: savedPortadaPath,
      pdf: savedPdfPath,
      paginas: paginas ? parseInt(paginas, 10) : 0,
      isbn: isbn ? isbn.trim() : (e_isbn ? e_isbn.trim() : ''),
      print_isbn: print_isbn ? print_isbn.trim() : '',
      e_isbn: e_isbn ? e_isbn.trim() : '',
      editorial: editorial ? editorial.trim() : 'Sello Editorial UTTECAM',
      idioma: idioma ? idioma.trim() : 'Español',
      materia: materia ? materia.trim() : '',
      volumen: volumen ? volumen.trim() : '1',
      paginas_impresion: paginas_impresion ? parseInt(paginas_impresion, 10) : 0,
      paginas_copia: paginas_copia ? parseInt(paginas_copia, 10) : 0,
      audio_disponible: audio_disponible === 'true' || audio_disponible === true,
      tipo_acceso: tipo_acceso ? tipo_acceso.trim() : 'MUPO - Multiusuario',
      limite_descargas_dia: limite_descargas_dia ? limite_descargas_dia.trim() : 'Ilimitado',
      limite_descargas_mes: limite_descargas_mes ? limite_descargas_mes.trim() : 'Ilimitado',
      tabla_contenidos: tabla_contenidos ? tabla_contenidos.trim() : '',
      fecha_publicacion: fecha_publicacion ? fecha_publicacion.trim() : new Date().getFullYear().toString(),
      permitir_descarga: permitir_descarga === 'false' || permitir_descarga === false ? false : true,
      orden: orden ? parseInt(orden, 10) : 0,
      activo: activo === 'false' || activo === false ? false : true,
      vistas: 0,
      descargas: 0,
      calificacion: 5.0,
      total_votos: 1,
    });

    return res.status(201).json(nuevaPublicacion);
  } catch (error: any) {
    console.error('Error al crear publicación:', error);
    return res.status(500).json({ error: error.message || 'Error interno al registrar la publicación', message: error.message });
  }
};

/**
 * Actualizar una publicación existente
 */
export const updatePublicacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await PublicacionUttecam.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const {
      titulo,
      edicion,
      autor,
      descripcion,
      categoria,
      paginas,
      isbn,
      print_isbn,
      e_isbn,
      editorial,
      idioma,
      materia,
      volumen,
      paginas_impresion,
      paginas_copia,
      audio_disponible,
      tipo_acceso,
      limite_descargas_dia,
      limite_descargas_mes,
      tabla_contenidos,
      fecha_publicacion,
      permitir_descarga,
      orden,
      activo,
    } = req.body;

    const savedPortadaPath = (req as any).savedPortadaPath;
    const savedPdfPath = (req as any).savedPdfPath;

    // Si se subió una portada nueva, eliminar la anterior si existe
    if (savedPortadaPath && publicacion.portada && publicacion.portada.startsWith('/uploads/')) {
      const oldPortadaPath = path.join(__dirname, '../../', publicacion.portada);
      deleteFile(oldPortadaPath);
      publicacion.portada = savedPortadaPath;
    } else if (savedPortadaPath) {
      publicacion.portada = savedPortadaPath;
    }

    // Si se subió un PDF nuevo, eliminar el anterior
    if (savedPdfPath && publicacion.pdf && publicacion.pdf.startsWith('/uploads/')) {
      const oldPdfPath = path.join(__dirname, '../../', publicacion.pdf);
      deleteFile(oldPdfPath);
      publicacion.pdf = savedPdfPath;
    } else if (savedPdfPath) {
      publicacion.pdf = savedPdfPath;
    }

    if (titulo !== undefined) publicacion.titulo = titulo.trim();
    if (edicion !== undefined) publicacion.edicion = edicion.trim();
    if (autor !== undefined) publicacion.autor = autor.trim();
    if (descripcion !== undefined) publicacion.descripcion = descripcion.trim();
    if (categoria !== undefined) publicacion.categoria = categoria.trim();
    if (paginas !== undefined) publicacion.paginas = parseInt(paginas, 10) || 0;
    if (isbn !== undefined) publicacion.isbn = isbn.trim();
    if (print_isbn !== undefined) publicacion.print_isbn = print_isbn.trim();
    if (e_isbn !== undefined) publicacion.e_isbn = e_isbn.trim();
    if (editorial !== undefined) publicacion.editorial = editorial.trim();
    if (idioma !== undefined) publicacion.idioma = idioma.trim();
    if (materia !== undefined) publicacion.materia = materia.trim();
    if (volumen !== undefined) publicacion.volumen = volumen.trim();
    if (paginas_impresion !== undefined) publicacion.paginas_impresion = parseInt(paginas_impresion, 10) || 0;
    if (paginas_copia !== undefined) publicacion.paginas_copia = parseInt(paginas_copia, 10) || 0;
    if (audio_disponible !== undefined) {
      publicacion.audio_disponible = audio_disponible === 'true' || audio_disponible === true;
    }
    if (tipo_acceso !== undefined) publicacion.tipo_acceso = tipo_acceso.trim();
    if (limite_descargas_dia !== undefined) publicacion.limite_descargas_dia = limite_descargas_dia.trim();
    if (limite_descargas_mes !== undefined) publicacion.limite_descargas_mes = limite_descargas_mes.trim();
    if (tabla_contenidos !== undefined) publicacion.tabla_contenidos = tabla_contenidos.trim();
    if (fecha_publicacion !== undefined) publicacion.fecha_publicacion = fecha_publicacion.trim();
    if (permitir_descarga !== undefined) {
      publicacion.permitir_descarga = permitir_descarga === 'true' || permitir_descarga === true;
    }
    if (orden !== undefined) publicacion.orden = parseInt(orden, 10) || 0;
    if (activo !== undefined) {
      publicacion.activo = activo === 'true' || activo === true;
    }

    await publicacion.save();

    return res.json(publicacion);
  } catch (error: any) {
    console.error('Error al actualizar publicación:', error);
    return res.status(500).json({ error: 'Error interno al actualizar la publicación' });
  }
};

/**
 * Eliminar una publicación
 */
export const deletePublicacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await PublicacionUttecam.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Eliminar archivos físicos
    if (publicacion.portada && publicacion.portada.startsWith('/uploads/')) {
      const portadaPath = path.join(__dirname, '../../', publicacion.portada);
      deleteFile(portadaPath);
    }
    if (publicacion.pdf && publicacion.pdf.startsWith('/uploads/')) {
      const pdfPath = path.join(__dirname, '../../', publicacion.pdf);
      deleteFile(pdfPath);
    }

    await publicacion.destroy();

    return res.json({ mensaje: 'Publicación eliminada correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar publicación:', error);
    return res.status(500).json({ error: 'Error interno al eliminar la publicación' });
  }
};

/**
 * Incrementar vistas (+1)
 */
export const incrementarVista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await PublicacionUttecam.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    await publicacion.increment('vistas', { by: 1 });
    await publicacion.reload();

    return res.json({ vistas: publicacion.vistas, mensaje: 'Vista registrada' });
  } catch (error: any) {
    console.error('Error al incrementar vistas:', error);
    return res.status(500).json({ error: 'Error al registrar vista' });
  }
};

/**
 * Incrementar descargas (+1)
 */
export const incrementarDescarga = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await PublicacionUttecam.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    if (!publicacion.permitir_descarga) {
      return res.status(403).json({
        error: 'Descarga no permitida',
        mensaje: 'La administración ha deshabilitado la descarga directa de esta publicación.',
      });
    }

    await publicacion.increment('descargas', { by: 1 });
    await publicacion.reload();

    return res.json({ descargas: publicacion.descargas, mensaje: 'Descarga registrada' });
  } catch (error: any) {
    console.error('Error al incrementar descargas:', error);
    return res.status(500).json({ error: 'Error al registrar descarga' });
  }
};

/**
 * Calificar publicación (1-5 estrellas persistente en BD)
 */
export const calificarPublicacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const numRating = Number(rating);

    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'La calificación debe ser un número entero entre 1 y 5' });
    }

    const publicacion = await PublicacionUttecam.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const votosActuales = publicacion.total_votos || 0;
    const calificacionActual = publicacion.calificacion || 5;
    const nuevoTotalVotos = votosActuales + 1;
    const nuevaCalificacion = ((calificacionActual * votosActuales) + numRating) / nuevoTotalVotos;

    publicacion.total_votos = nuevoTotalVotos;
    publicacion.calificacion = Number(nuevaCalificacion.toFixed(1));
    await publicacion.save();

    return res.json({
      calificacion: publicacion.calificacion,
      total_votos: publicacion.total_votos,
      mensaje: 'Calificación guardada con éxito',
    });
  } catch (error: any) {
    console.error('Error al calificar publicación:', error);
    return res.status(500).json({ error: 'Error al registrar la calificación' });
  }
};

/**
 * Toggle rápido de permiso de descarga
 */
export const togglePermitirDescarga = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await PublicacionUttecam.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    publicacion.permitir_descarga = !publicacion.permitir_descarga;
    await publicacion.save();

    return res.json({
      permitir_descarga: publicacion.permitir_descarga,
      mensaje: `Permiso de descarga ${publicacion.permitir_descarga ? 'activado' : 'desactivado'}`,
    });
  } catch (error: any) {
    console.error('Error al cambiar permiso de descarga:', error);
    return res.status(500).json({ error: 'Error al actualizar permiso' });
  }
};
