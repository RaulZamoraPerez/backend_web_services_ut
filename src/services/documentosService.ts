// Ejemplo de uso de los modelos Area, Categorias y Archivos
// Este archivo muestra cómo usar los modelos con sus relaciones jerárquicas

import { Area, Categorias, Archivos } from '../models/associations';

export class DocumentosService {
  
  // 1. Obtener todas las áreas con sus categorías y archivos (estructura completa)
  static async getCompleteStructure() {
    try {
      const areas = await Area.findAll({
        include: [{
          model: Categorias,
          as: 'categorias',
          required: false, // LEFT JOIN - incluir áreas sin categorías
          include: [{
            model: Archivos,
            as: 'archivos',
            required: false // LEFT JOIN - incluir categorías sin archivos
          }]
        }]
      });
      return areas;
    } catch (error) {
      console.error('Error al obtener estructura completa:', error);
      throw error;
    }
  }

  // 2. Obtener un área específica con todo su contenido
  static async getAreaById(areaId: number) {
    try {
      const area = await Area.findByPk(areaId, {
        include: [{
          model: Categorias,
          as: 'categorias',
          required: false, // LEFT JOIN - incluir área aunque no tenga categorías
          include: [{
            model: Archivos,
            as: 'archivos',
            required: false // LEFT JOIN - incluir categorías aunque no tengan archivos
          }]
        }]
      });
      return area;
    } catch (error) {
      console.error('Error al obtener área por ID:', error);
      throw error;
    }
  }

  // 3. Obtener una categoría con sus archivos
  static async getCategoryWithFiles(categoryId: number) {
    try {
      const categoria = await Categorias.findByPk(categoryId, {
        include: [
          {
            model: Area,
            as: 'area'
          },
          {
            model: Archivos,
            as: 'archivos'
          }
        ]
      });
      return categoria;
    } catch (error) {
      console.error('Error al obtener categoría con archivos:', error);
      throw error;
    }
  }

  // 4. Obtener un archivo con toda su información jerárquica
  static async getFileWithHierarchy(fileId: number) {
    try {
      const archivo = await Archivos.findByPk(fileId, {
        include: [{
          model: Categorias,
          as: 'categoria',
          include: [{
            model: Area,
            as: 'area'
          }]
        }]
      });
      return archivo;
    } catch (error) {
      console.error('Error al obtener archivo con jerarquía:', error);
      throw error;
    }
  }

  // 5. Crear nueva área
  static async createArea(nombre: string) {
    try {
      const area = await Area.create({
        Nombre: nombre
      });
      return area;
    } catch (error) {
      console.error('Error al crear área:', error);
      throw error;
    }
  }

  // 6. Crear nueva categoría
  static async createCategory(nombre: string, areaId: number) {
    try {
      // Verificar si ya existe una categoría con el mismo nombre en la misma área
      const categoriaExistente = await Categorias.findOne({
        where: {
          Nombre: nombre,
          ID_Area: areaId
        }
      });

      if (categoriaExistente) {
        const error = new Error('Ya existe una categoría con ese nombre en esta área');
        (error as any).status = 409; // Conflict
        throw error;
      }

      const categoria = await Categorias.create({
        Nombre: nombre,
        ID_Area: areaId
      });
      return categoria;
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      
      // Si es un error de Sequelize por restricción única
      if (error.name === 'SequelizeUniqueConstraintError') {
        const err = new Error('Ya existe una categoría con ese nombre');
        (err as any).status = 409;
        throw err;
      }
      
      throw error;
    }
  }

  // 7. Crear nuevo archivo
  static async createFile(data: {
    Nombre: string;
    Descripcion?: string;
    Ruta_Documento: string;
    ID_Categorias: number;
  }) {
    try {
      const archivo = await Archivos.create(data);
      return archivo;
    } catch (error) {
      console.error('Error al crear archivo:', error);
      throw error;
    }
  }

  // 8. Obtener archivos de un área específica (a través de sus categorías)
  static async getFilesByArea(areaId: number) {
    try {
      const archivos = await Archivos.findAll({
        include: [{
          model: Categorias,
          as: 'categoria',
          where: { ID_Area: areaId },
          include: [{
            model: Area,
            as: 'area'
          }]
        }]
      });
      return archivos;
    } catch (error) {
      console.error('Error al obtener archivos por área:', error);
      throw error;
    }
  }

  // 9. Estadísticas: contar archivos por área
  static async getStatsPerArea() {
    try {
      const stats = await Area.findAll({
        attributes: [
          'ID_Area',
          'Nombre'
        ],
        include: [{
          model: Categorias,
          as: 'categorias',
          attributes: [],
          include: [{
            model: Archivos,
            as: 'archivos',
            attributes: []
          }]
        }]
      });
      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export default DocumentosService;