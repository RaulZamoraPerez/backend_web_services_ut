import { Request, Response, NextFunction } from 'express';
import { Op, ValidationError } from 'sequelize';
import SolicitudesConstanciasKardex from '../models/Solicitud_Constancia';
import { logSecurityEvent } from '../middleware/logging';

// Obtener todas las solicitudes (con paginación y filtros)
export const getAllSolicitudes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      estado,
      nivel,
      carrera,
      tipo_entrega,
      matricula,
      fecha_desde,
      fecha_hasta
    } = req.query;

    // Construcción dinámica de filtros
    const whereClause: any = {};

    if (estado) whereClause.estado = estado;
    if (nivel) whereClause.nivel = nivel;
    if (carrera) whereClause.carrera = { [Op.iLike]: `%${carrera}%` };
    if (tipo_entrega) whereClause.tipo_entrega = tipo_entrega;
    if (matricula) whereClause.matricula = matricula;

    // Filtros por fechas
    if (fecha_desde || fecha_hasta) {
      whereClause.fecha_solicitud = {};
      if (fecha_desde) whereClause.fecha_solicitud[Op.gte] = new Date(fecha_desde as string);
      if (fecha_hasta) whereClause.fecha_solicitud[Op.lte] = new Date(fecha_hasta as string);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: solicitudes } = await SolicitudesConstanciasKardex.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['fecha_solicitud', 'DESC']]
    });

    res.status(200).json({
      message: 'Solicitudes obtenidas correctamente',
      data: solicitudes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalSolicitudes: count,
        solicitudesPorPagina: Number(limit)
      },
      filters: {
        estado,
        nivel,
        carrera,
        tipo_entrega,
        matricula,
        fecha_desde,
        fecha_hasta
      }
    });

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    next(error);
  }
};

// Obtener una solicitud por ID
export const getSolicitudById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número válido'
      });
    }

    const solicitud = await SolicitudesConstanciasKardex.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({
        error: 'Solicitud no encontrada',
        message: 'No se encontró la solicitud con el ID proporcionado'
      });
    }

    res.status(200).json({
      message: 'Solicitud encontrada',
      data: solicitud
    });

  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    next(error);
  }
};

// Obtener solicitud por matrícula
export const getSolicitudByMatricula = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { matricula } = req.params;

    if (!matricula || matricula.length !== 8) {
      return res.status(400).json({
        error: 'Matrícula inválida',
        message: 'La matrícula debe tener exactamente 8 caracteres'
      });
    }

    const solicitudes = await SolicitudesConstanciasKardex.findAll({
      where: { matricula },
      order: [['fecha_solicitud', 'DESC']]
    });

    res.status(200).json({
      message: `Solicitudes encontradas para la matrícula ${matricula}`,
      data: solicitudes,
      total: solicitudes.length
    });

  } catch (error) {
    console.error('Error al obtener solicitudes por matrícula:', error);
    next(error);
  }
};

// Crear nueva solicitud
export const crearSolicitud = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      nombre,
      matricula,
      correo,
      telefono,
      carrera,
      nivel,
      tipo_entrega,
      documentos_solicitados,
      observaciones
    } = req.body;

    // Verificar si ya existe una solicitud pendiente para esta matrícula
    const solicitudExistente = await SolicitudesConstanciasKardex.findOne({
      where: {
        matricula,
        estado: ['pendiente', 'en_proceso']
      }
    });

    if (solicitudExistente) {
      return res.status(400).json({
        error: 'Solicitud duplicada',
        message: `Ya existe una solicitud ${solicitudExistente.estado} para esta matrícula`,
        solicitudExistente: {
          id: solicitudExistente.id,
          estado: solicitudExistente.estado,
          fecha_solicitud: solicitudExistente.fecha_solicitud
        }
      });
    }

    // Crear la solicitud
    const nuevaSolicitud = await SolicitudesConstanciasKardex.create({
      nombre,
      matricula,
      correo,
      telefono,
      carrera,
      nivel,
      tipo_entrega,
      documentos_solicitados,
      observaciones: observaciones || null
    });

    // Log de seguridad para auditoría
    logSecurityEvent('Solicitud de constancia creada', 'info', {
      solicitudId: nuevaSolicitud.id,
      matricula: nuevaSolicitud.matricula,
      documentos: nuevaSolicitud.documentos_solicitados,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      data: nuevaSolicitud,
      instrucciones: {
        seguimiento: `Use el ID de solicitud ${nuevaSolicitud.id} para dar seguimiento a su solicitud`,
        tiempoEstimado: tipo_entrega === 'electronico' ? '3-5 días hábiles' : '5-7 días hábiles',
        contacto: 'Para consultas, contacte al departamento de servicios escolares'
      }
    });

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Error de validación',
        message: 'Los datos proporcionados no son válidos',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }

    console.error('Error al crear solicitud:', error);
    next(error);
  }
};

// Actualizar estado de solicitud (solo para administradores)
export const actualizarEstadoSolicitud = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { estado, observaciones, fecha_entrega } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número válido'
      });
    }

    const solicitud = await SolicitudesConstanciasKardex.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({
        error: 'Solicitud no encontrada',
        message: 'No se encontró la solicitud con el ID proporcionado'
      });
    }

    // Actualizar campos
    const datosActualizacion: any = {};
    
    if (estado) datosActualizacion.estado = estado;
    if (observaciones !== undefined) datosActualizacion.observaciones = observaciones;
    if (fecha_entrega) datosActualizacion.fecha_entrega = new Date(fecha_entrega);
    
    // Si se marca como completado y no se proporciona fecha de entrega, usar la actual
    if (estado === 'completado' && !fecha_entrega) {
      datosActualizacion.fecha_entrega = new Date();
    }

    await solicitud.update(datosActualizacion);

    // Log de seguridad para auditoría
    logSecurityEvent('Estado de solicitud actualizado', 'info', {
      solicitudId: solicitud.id,
      estadoAnterior: solicitud.estado,
      estadoNuevo: estado,
      matricula: solicitud.matricula,
      actualizadoPor: req.user?.username || 'sistema',
      ip: req.ip
    });

    res.status(200).json({
      message: 'Estado de solicitud actualizado correctamente',
      data: solicitud,
      cambios: datosActualizacion
    });

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Error de validación',
        message: 'Los datos proporcionados no son válidos',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }

    console.error('Error al actualizar estado de solicitud:', error);
    next(error);
  }
};

// Eliminar solicitud (solo para administradores)
export const eliminarSolicitud = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        error: 'ID inválido',
        message: 'El ID debe ser un número válido'
      });
    }

    const solicitud = await SolicitudesConstanciasKardex.findByPk(id);

    if (!solicitud) {
      return res.status(404).json({
        error: 'Solicitud no encontrada',
        message: 'No se encontró la solicitud con el ID proporcionado'
      });
    }

    // Guardar información para el log antes de eliminar
    const solicitudInfo = {
      id: solicitud.id,
      matricula: solicitud.matricula,
      estado: solicitud.estado
    };

    await solicitud.destroy();

    // Log de seguridad para auditoría
    logSecurityEvent('Solicitud eliminada', 'warn', {
      solicitudEliminada: solicitudInfo,
      eliminadaPor: req.user?.username || 'sistema',
      ip: req.ip
    });

    res.status(200).json({
      message: 'Solicitud eliminada correctamente',
      solicitudEliminada: solicitudInfo
    });

  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    next(error);
  }
};

// Obtener estadísticas de solicitudes
export const getEstadisticasSolicitudes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { año, mes } = req.query;

    // Construir filtros de fecha si se proporcionan
    const whereClause: any = {};
    if (año) {
      const startDate = new Date(`${año}-01-01`);
      const endDate = new Date(`${año}-12-31`);
      whereClause.fecha_solicitud = {
        [Op.between]: [startDate, endDate]
      };
      
      if (mes) {
        const startMonth = new Date(`${año}-${mes}-01`);
        const endMonth = new Date(Number(año), Number(mes), 0); // Último día del mes
        whereClause.fecha_solicitud = {
          [Op.between]: [startMonth, endMonth]
        };
      }
    }

    // Estadísticas generales
    const totalSolicitudes = await SolicitudesConstanciasKardex.count({ where: whereClause });
    
    // Por estado
    const porEstado = await SolicitudesConstanciasKardex.findAll({
      where: whereClause,
      attributes: [
        'estado',
        [SolicitudesConstanciasKardex.sequelize!.fn('COUNT', SolicitudesConstanciasKardex.sequelize!.col('estado')), 'cantidad']
      ],
      group: ['estado'],
      raw: true
    });

    // Por nivel
    const porNivel = await SolicitudesConstanciasKardex.findAll({
      where: whereClause,
      attributes: [
        'nivel',
        [SolicitudesConstanciasKardex.sequelize!.fn('COUNT', SolicitudesConstanciasKardex.sequelize!.col('nivel')), 'cantidad']
      ],
      group: ['nivel'],
      raw: true
    });

    // Por tipo de entrega
    const porTipoEntrega = await SolicitudesConstanciasKardex.findAll({
      where: whereClause,
      attributes: [
        'tipo_entrega',
        [SolicitudesConstanciasKardex.sequelize!.fn('COUNT', SolicitudesConstanciasKardex.sequelize!.col('tipo_entrega')), 'cantidad']
      ],
      group: ['tipo_entrega'],
      raw: true
    });

    // Documentos más solicitados
    const todasSolicitudes = await SolicitudesConstanciasKardex.findAll({
      where: whereClause,
      attributes: ['documentos_solicitados']
    });

    const conteoDocumentos: { [key: string]: number } = {};
    todasSolicitudes.forEach(solicitud => {
      solicitud.documentos_solicitados.forEach(doc => {
        conteoDocumentos[doc] = (conteoDocumentos[doc] || 0) + 1;
      });
    });

    const documentosMasSolicitados = Object.entries(conteoDocumentos)
      .map(([documento, cantidad]) => ({ documento, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    res.status(200).json({
      message: 'Estadísticas obtenidas correctamente',
      periodo: {
        año: año || 'Todos',
        mes: mes || 'Todos'
      },
      estadisticas: {
        totalSolicitudes,
        porEstado,
        porNivel,
        porTipoEntrega,
        documentosMasSolicitados
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    next(error);
  }
};

// Buscar solicitudes avanzada
export const buscarSolicitudes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      termino,
      campo = 'todos', // nombre, matricula, correo, carrera, todos
      page = 1,
      limit = 10
    } = req.query;

    if (!termino) {
      return res.status(400).json({
        error: 'Término de búsqueda requerido',
        message: 'Debe proporcionar un término para realizar la búsqueda'
      });
    }

    let whereClause: any = {};

    switch (campo) {
      case 'nombre':
        whereClause.nombre = { [Op.iLike]: `%${termino}%` };
        break;
      case 'matricula':
        whereClause.matricula = { [Op.iLike]: `%${termino}%` };
        break;
      case 'correo':
        whereClause.correo = { [Op.iLike]: `%${termino}%` };
        break;
      case 'carrera':
        whereClause.carrera = { [Op.iLike]: `%${termino}%` };
        break;
      default: // 'todos'
        whereClause = {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${termino}%` } },
            { matricula: { [Op.iLike]: `%${termino}%` } },
            { correo: { [Op.iLike]: `%${termino}%` } },
            { carrera: { [Op.iLike]: `%${termino}%` } }
          ]
        };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: solicitudes } = await SolicitudesConstanciasKardex.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['fecha_solicitud', 'DESC']]
    });

    res.status(200).json({
      message: 'Búsqueda completada',
      busqueda: {
        termino,
        campo,
        resultados: count
      },
      data: solicitudes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalResultados: count,
        resultadosPorPagina: Number(limit)
      }
    });

  } catch (error) {
    console.error('Error en búsqueda de solicitudes:', error);
    next(error);
  }
};