import { NextFunction, Request, Response } from "express";
import NosotrosContent from "../models/Nosotros";
import path from 'path';
import fs from 'fs';
import { deleteFile } from "../middleware/uploadMiddleware";

// ============================================
// HELPER: normalizar noDiscriminacion al formato
// unificado { text: string, items: string[] }
// ============================================
const normalizeNoDisc = (raw: any): { text: string; items: string[] } => {
  if (!raw) return { text: '', items: [] };

  // Formato nuevo: { text?, items? }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const items = Array.isArray(raw.items)
      ? (raw.items as any[]).flat().filter((v: any) => typeof v === 'string') as string[]
      : [];
    return {
      text: typeof raw.text === 'string' ? raw.text : '',
      items,
    };
  }

  // Formato viejo: string[][] (3 columnas)
  if (Array.isArray(raw)) {
    const flatItems = (raw as any[])
      .flat()
      .filter((v: any) => typeof v === 'string') as string[];
    return { text: '', items: flatItems };
  }

  return { text: '', items: [] };
};

// ============================================
// CONTROLADOR PARA CONTENIDO DE "NOSOTROS"
// ============================================

// GET /api/nosotros/content
// Obtener todo el contenido de la página "Nosotros"
export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el contenido (debería haber solo un registro)
    const content = await NosotrosContent.findOne();

    if (!content) {
      // Retornar null pero con status 200 para permitir que el frontend inicialice el formulario
      return res.status(200).json(null);
    }

    // Obtener los datos como JSON
    const data = content.toJSON();

    // Parsear campos JSON si vienen como string (problema con Sequelize en MySQL)
    const parseIfString = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const parsedData = {
      ...data,
      politicaIntegral: parseIfString(data.politicaIntegral),
      vision: parseIfString(data.vision),
      mision: parseIfString(data.mision),
      valores: parseIfString(data.valores),
      // Siempre devolver { text, items } independientemente del formato en BD
      noDiscriminacion: normalizeNoDisc(parseIfString(data.noDiscriminacion)),
    };

    res.json(parsedData);
  } catch (error) {
    next(error);
  }
};

// PUT /api/nosotros/content
// Actualizar todo el contenido de la página "Nosotros"
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      vision,
      mision,
      valores,
      politicaIntegral,
      objetivoIntegral,
      noDiscriminacion
    } = req.body;

    // Validar estructura básica (solo los campos principales son requeridos)
    if (!vision || !mision) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: "Vision y Misión son requeridas"
      });
    }

    // Usar valores por defecto para campos opcionales
    const safeValores = valores || { description: [] };
    const safePoliticaIntegral = politicaIntegral || { imageSrc: '', title: '', description: '' };
    const safeObjetivoIntegral = objetivoIntegral || '';
    const safeNoDiscriminacion = noDiscriminacion || [];

    // Validate title lengths (no more than 255 characters)
    const sectionsToCheck: any[] = [vision, mision, safeValores, safePoliticaIntegral];
    for (const s of sectionsToCheck) {
      if (s && s.title && s.title.length > 255) {
        return res.status(400).json({ error: 'Title too long', message: 'One of the section titles exceeds 255 characters' });
      }
    }

    // Buscar o crear el contenido
    let content = await NosotrosContent.findOne();

    if (!content) {
      content = await NosotrosContent.create({
        vision,
        mision,
        valores: safeValores,
        politicaIntegral: safePoliticaIntegral,
        objetivoIntegral: safeObjetivoIntegral,
        noDiscriminacion: safeNoDiscriminacion
      });
    } else {
      await content.update({
        vision,
        mision,
        valores: safeValores,
        politicaIntegral: safePoliticaIntegral,
        objetivoIntegral: safeObjetivoIntegral,
        noDiscriminacion: safeNoDiscriminacion
      });
    }

    res.json({
      message: "Contenido actualizado exitosamente",
      content: content.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/nosotros/content/:section
// Actualizar una sección específica del contenido
export const updateSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;
    const updateData = req.body;

    // Validar que la sección sea válida
    const validSections = ['vision', 'mision', 'valores', 'politicaIntegral', 'objetivoIntegral', 'noDiscriminacion'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        details: `Las secciones válidas son: ${validSections.join(', ')}`
      });
    }

    // Buscar el contenido
    let content = await NosotrosContent.findOne();

    if (!content) {
      // Si no existe, creamos uno con valores por defecto
      content = await NosotrosContent.create({
        vision: { description: '' },
        mision: { description: '' },
        valores: { description: [] },
        politicaIntegral: { imageSrc: '', title: '', description: '' },
        objetivoIntegral: '',
        noDiscriminacion: []
      } as any);
    }

    // El frontend envía { [section]: data }, extraer los datos de la sección
    let sectionData = updateData[section] || updateData;

    // objetivoIntegral es un STRING en la BD, pero el frontend envía {text: "..."}
    // Necesitamos extraer solo el texto
    if (section === 'objetivoIntegral') {
      if (typeof sectionData === 'object' && sectionData !== null && 'text' in sectionData) {
        sectionData = (sectionData as any).text || '';
      } else if (typeof sectionData !== 'string') {
        sectionData = '';
      }
    }

    // noDiscriminacion: puede llegar como { items, text } (dashboard) o string[][]
    // Siempre guardamos en formato { text, items } para consistencia
    if (section === 'noDiscriminacion') {
      let currentRaw = content.get('noDiscriminacion' as any);
      if (typeof currentRaw === 'string') {
        try { currentRaw = JSON.parse(currentRaw); } catch (_) { }
      }
      const current = normalizeNoDisc(currentRaw);
      const incoming = normalizeNoDisc(sectionData);
      const updateObj: any = {};
      updateObj['noDiscriminacion'] = {
        text: incoming.text !== '' ? incoming.text : current.text,
        items: incoming.items.length > 0 ? incoming.items : current.items,
      };
      await content.update(updateObj);
      await content.reload();
      let saved = content.get('noDiscriminacion' as any);
      if (typeof saved === 'string') { try { saved = JSON.parse(saved); } catch (_) { } }
      return res.json({
        message: 'Sección noDiscriminacion actualizada exitosamente',
        noDiscriminacion: normalizeNoDisc(saved),
      });
    }

    // Validate title length for updated section
    if (sectionData && typeof sectionData === 'object' && (sectionData as any).title && (sectionData as any).title.length > 255) {
      return res.status(400).json({ error: 'Title too long', message: 'The section title exceeds the maximum length of 255 characters' });
    }

    // Obtener datos actuales de la sección para fusionar
    let currentRaw = content.get(section as any);
    let currentParsed = currentRaw;
    if (typeof currentRaw === 'string') {
      try { currentParsed = JSON.parse(currentRaw); } catch (e) { }
    }

    // Actualizar solo la sección especificada, fusionando con lo existente si es objeto
    const updateObj: any = {};

    if (typeof sectionData === 'object' && sectionData !== null && typeof currentParsed === 'object' && currentParsed !== null && !Array.isArray(currentParsed)) {
      // Merge solo si ambos son objetos planos (no arrays)
      updateObj[section] = { ...currentParsed, ...sectionData };
    } else {
      updateObj[section] = sectionData;
    }

    await content.update(updateObj);

    // Recargar el contenido actualizado
    await content.reload();

    // Parsear el campo actualizado si es necesario
    const parseIfString = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const updatedValue = parseIfString(content[section as keyof typeof content]);

    res.json({
      message: `Sección ${section} actualizada exitosamente`,
      [section]: updatedValue
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/nosotros/content
// Crear nuevo contenido (reemplaza el existente si ya hay uno)
export const createContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      vision,
      mision,
      valores,
      politicaIntegral,
      objetivoIntegral,
      noDiscriminacion
    } = req.body;

    // Validar estructura básica
    if (!vision || !mision || !valores || !politicaIntegral || !objetivoIntegral || !noDiscriminacion) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: "Todas las secciones son requeridas"
      });
    }

    // Eliminar contenido existente si hay uno
    await NosotrosContent.destroy({ where: {} });

    // Crear nuevo contenido
    const newContent = await NosotrosContent.create({
      vision,
      mision,
      valores,
      politicaIntegral,
      objetivoIntegral,
      noDiscriminacion
    });

    res.status(201).json({
      message: "Contenido creado exitosamente",
      content: newContent.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/nosotros/content/:section
// Obtener una sección específica del contenido
export const getSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;

    // Validar que la sección sea válida
    const validSections = ['vision', 'mision', 'valores', 'politicaIntegral', 'objetivoIntegral', 'noDiscriminacion'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        details: `Las secciones válidas son: ${validSections.join(', ')}`
      });
    }

    // Obtener el contenido
    const content = await NosotrosContent.findOne();

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
        message: "El contenido de 'Nosotros' no ha sido creado aún. Use POST /api/nosotros/content para crear el contenido inicial."
      });
    }

    // Parsear el campo si es un string JSON
    let sectionData = content[section as keyof typeof content];
    if (typeof sectionData === 'string' && (section === 'vision' || section === 'mision' || section === 'valores' || section === 'noDiscriminacion')) {
      try {
        sectionData = JSON.parse(sectionData);
      } catch {
        // Si no se puede parsear, dejar como está
      }
    }

    res.json({
      [section]: sectionData
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/nosotros/content
// Eliminar todo el contenido
export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = await NosotrosContent.findOne(); // Find the content before deleting

    if (content) {
      // 1. Eliminar archivos físicos de todas las secciones que tengan imágenes
      const sectionsWithImages = ['vision', 'mision', 'valores', 'politicaIntegral']; // 'organigrama' is not a valid section in this context
      for (const section of sectionsWithImages) {
        let sectionData = content[section as keyof typeof content];
        if (typeof sectionData === 'string') {
          try { sectionData = JSON.parse(sectionData); } catch (e) { }
        }
        if (sectionData && (sectionData as any).imageSrc) {
          deleteFile((sectionData as any).imageSrc);
        }
      }
      // 2. Eliminar de la base de datos
      await content.destroy();
      res.json({ message: "Contenido de 'Nosotros' y sus archivos físicos eliminados exitosamente", deletedCount: 1 });
    } else {
      res.json({ message: "No se encontró contenido para eliminar", deletedCount: 0 });
    }
  } catch (error) {
    next(error);
  }
};

// DELETE /api/nosotros/content/:section
// Eliminar una sección específica (restaurar valores por defecto)
export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.params;

    // Validar que la sección sea válida
    const validSections = ['vision', 'mision', 'valores', 'politicaIntegral', 'objetivoIntegral', 'noDiscriminacion'];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        details: `Las secciones válidas son: ${validSections.join(', ')}`
      });
    }

    // Buscar el contenido
    const content = await NosotrosContent.findOne();

    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado"
      });
    }

    // 1. Eliminar imagen física si existe
    let sectionData = content[section as keyof typeof content];
    if (typeof sectionData === 'string') {
      try { sectionData = JSON.parse(sectionData); } catch (e) { }
    }
    if (sectionData && (sectionData as any).imageSrc) {
      deleteFile((sectionData as any).imageSrc);
    }

    // 2. Valores por defecto
    const defaultValues: any = {
      vision: {
        imageSrc: 'nosotros/vision_1759772754247.png',
        title: 'Visión',
        description: 'En el año 2027 ser una institución de excelencia, reconocida Nacional e Internacionalmente por su eficiencia, eficacia, pertinencia, equidad, inclusión, vinculación y cuerpos académicos consolidados y comprometidos con las expectativas de los aprendientes y de la sociedad, al brindar educación de calidad y profesionistas con alto sentido humano, competitivos e integrados en el ámbito productivo'
      },
      mision: {
        imageSrc: 'nosotros/general_1761952064258_e361d82abad6d8113e2ec6074b4ef15a.png',
        title: 'Misión',
        description: 'Somos una Institución de Educación Superior comprometida con la excelencia, transparencia y rendición de cuentas, que brinda servicios educativos, científicos y tecnológicos con calidad, equidad, inclusión, responsabilidad social y sentido humano para contribuir al bienestar y desarrollo integral regional, estatal y nacional, cumpliendo los requerimientos de las partes interesadas, mediante un modelo formativo integral.'
      },
      valores: {
        imageSrc: 'nosotros/general_1761952189846_0697273e3d61620d3c56851a66ecec60.png',
        title: 'Valores',
        description: [
          'Austeridad',
          'Honestidad',
          'Empatía',
          'Generosidad',
          'Respeto',
          'Tolerancia',
          'Igualdad',
          'Equidad',
          'Justicia',
          'Fraternidad',
          'Compromiso',
          'Bien Común'
        ]
      },
      politicaIntegral: 'Somos una institución comprometida en la formación de profesionistas con responsabilidad social, sentido humano y ético, que en conjunto con la comunidad universitaria, contribuyen al desarrollo sustentable a través de establecimiento de objetivos integrales, actualización e innovación de los programas educativos, gestión de la propiedad intelectual y la mejora continua del Sistema de Gestión Integral, considerando el desarrollo educativo, científico y técnico, cumpliendo el marco legal aplicable, considerando las necesidades y expectativas de las partes interesadas, atendiendo los criterios ambientales de manera que se pueda controlar y prevenir la contaminación derivada de nuestros procesos y servicios para la preservación del medio ambiente.',
      objetivoIntegral: 'Formar integralmente profesionistas competentes socialmente responsables, creativos, emprendedores e innovadores, comprometidos con el cuidado del medio ambiente y la sustentabilidad, a través del proceso enseñanza-aprendizaje, conducido por una planta docente con sentido humano, perfil profesional, experiencia y capacitación adecuada para la realización de su labor educativa.',
      noDiscriminacion: [
        [
          'Apariencia Física',
          'Cultura',
          'Discapacidad',
          'Idioma'
        ],
        [
          'Estado civil',
          'Religión',
          'Sexo',
          'Embarazo'
        ],
        [
          'Opiniones',
          'Origen étnico o nacional',
          'Género',
          'Edad'
        ]
      ]
    };

    // Actualizar la sección con valores por defecto
    const updateObj: any = {};
    updateObj[section] = defaultValues[section as keyof typeof defaultValues];

    await content.update(updateObj);

    res.json({
      message: `Sección ${section} restaurada a valores por defecto`,
      [section]: content[section as keyof typeof content]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/nosotros/upload-image
// Subir imagen para una sección específica de "Nosotros"
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section, ...additionalData } = req.body;

    // Validar que se especificó la sección
    if (!section) {
      return res.status(400).json({
        error: "Sección requerida",
        message: "Debe especificar la sección (politicaIntegral, vision, mision, valores)"
      });
    }

    // Validar que la sección es válida
    if (!['politicaIntegral', 'vision', 'mision', 'valores'].includes(section)) {
      return res.status(400).json({
        error: "Sección inválida",
        message: "La sección debe ser: politicaIntegral, vision, mision o valores"
      });
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        error: "Archivo requerido",
        message: "No se encontró ningún archivo en la solicitud"
      });
    }

    // Obtener el contenido actual
    let content = await NosotrosContent.findOne();
    if (!content) {
      return res.status(404).json({
        error: "Contenido no encontrado",
        message: "Debe crear el contenido de 'Nosotros' antes de subir imágenes"
      });
    }

    // Construir la URL relativa del archivo
    const relativePath = `nosotros/${req.file.filename}`;

    // Obtener el contenido actual de la sección y parsearlo si es necesario
    let sectionData = content[section as keyof typeof content];

    // Parsear el campo si es un string JSON
    if (typeof sectionData === 'string') {
      try {
        sectionData = JSON.parse(sectionData);
      } catch {
        return res.status(500).json({
          error: "Error al parsear el contenido de la sección",
          message: "El contenido de la sección no está en el formato correcto"
        });
      }
    }

    // Si ya existe una imagen en esta sección, eliminar el archivo físico anterior
    const oldImageSrc: string | undefined = (sectionData as any)?.imageSrc;
    if (oldImageSrc) {
      // Construir ruta absoluta: uploads/ está 2 niveles arriba de src/controllers/
      const uploadsDir = path.join(__dirname, '../../uploads');
      const absoluteOldPath = path.join(uploadsDir, oldImageSrc);
      const deleted = deleteFile(absoluteOldPath);
      if (!deleted) {
        console.warn(`[uploadImage] No se pudo eliminar imagen anterior: ${absoluteOldPath}`);
      }
    }

    // Construir el objeto actualizado con la nueva imagen y datos adicionales
    const updatedSectionData: any = {
      ...(sectionData as object),
      imageSrc: relativePath
    };

    // Procesar los datos adicionales del FormData
    // Si se envió 'data' como payload JSON, usarlo para actualizar la sección
    let parsedAdditional: any = {};
    if (additionalData.data) {
      try {
        parsedAdditional = typeof additionalData.data === 'string' ? JSON.parse(additionalData.data) : additionalData.data;
      } catch {
        parsedAdditional = {};
      }
    } else {
      // Compatibilidad con el formato antiguo: description y title en campos separados
      if (additionalData.description) {
        try {
          parsedAdditional.description = typeof additionalData.description === 'string' ? JSON.parse(additionalData.description) : additionalData.description;
        } catch {
          parsedAdditional.description = additionalData.description;
        }
      }
      if (additionalData.title) {
        parsedAdditional.title = additionalData.title;
      }
      if (additionalData.text) {
        parsedAdditional.text = additionalData.text;
      }
      if (additionalData.items) {
        try {
          parsedAdditional.items = typeof additionalData.items === 'string' ? JSON.parse(additionalData.items) : additionalData.items;
        } catch {
          parsedAdditional.items = additionalData.items;
        }
      }
    }

    // Merge parsedAdditional into updatedSectionData
    Object.assign(updatedSectionData, parsedAdditional);

    // Validate title length if present
    if (updatedSectionData.title && updatedSectionData.title.length > 255) {
      return res.status(400).json({ error: 'Title too long', message: 'The provided title exceeds the max length of 255 characters' });
    }

    // Guardar solo la sección actualizada
    await content.update({
      [section]: updatedSectionData
    });

    res.json({
      message: `Imagen subida exitosamente para la sección ${section}`,
      section: section,
      imageSrc: relativePath,
      filename: req.file.filename
    });

  } catch (error) {
    // Si hay un error, eliminar el archivo subido si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};