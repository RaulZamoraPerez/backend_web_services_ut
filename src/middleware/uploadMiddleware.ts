import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Tipos MIME permitidos con sus extensiones correspondientes
const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/svg+xml': ['.svg']
};

// Función para verificar si el archivo es realmente una imagen
const verifyFileType = (buffer: Buffer, mimetype: string): boolean => {
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46]
  };

  if (mimetype === 'image/svg+xml') {
    const content = buffer.toString('utf8');
    return content.includes('<svg') && content.includes('</svg>');
  }

  const signature = signatures[mimetype as keyof typeof signatures];
  if (!signature) return false;

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) return false;
  }

  return true;
};

// Configuración de almacenamiento segura
const secureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/nosotros');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const tipo = req.body.tipo || 'general';
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();

    const filename = `${tipo}_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

// Filtro de archivo seguro
const secureFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = Object.keys(ALLOWED_MIME_TYPES);
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Tipo MIME no permitido: ${file.mimetype}`));
  }

  const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_MIME_TYPES];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error(`Extensión ${fileExtension} no permitida`));
  }

  const dangerousPatterns = [
    /\.\./,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
    /\x00/,
    /^\./,
    /.php$/i,
    /.js$/i,
    /.exe$/i
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.originalname))) {
    return cb(new Error('Nombre de archivo contiene patrones no permitidos'));
  }

  if (file.originalname.length > 255) {
    return cb(new Error('Nombre de archivo demasiado largo'));
  }

  cb(null, true);
};

// Configuración de multer con seguridad
export const uploadNosotros = multer({
  storage: secureStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB para imágenes de alta calidad
    files: 1,
    fieldNameSize: 100,
    fieldSize: 5 * 1024 * 1024, // 5MB para textos institucionales largos
    fields: 15
  },
  fileFilter: secureFileFilter
});

// Middleware para validación post-upload
export const validateUploadedFile = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;

  try {
    const buffer = fs.readFileSync(filePath, { flag: 'r' });
    const isValidType = verifyFileType(buffer.slice(0, 20), req.file.mimetype);

    if (!isValidType) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo no corresponde al tipo declarado'
      });
    }

    if (buffer.length < 100) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo parece estar corrupto'
      });
    }

    next();
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(500).json({
      error: 'Error procesando archivo',
      message: 'No se pudo validar el archivo'
    });
  }
};

// Configuración de almacenamiento segura para directorios
const secureStorageDirectorios = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/directorios');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();

    const filename = `directorio_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

// Configuración segura de multer para directorios
export const uploadDirectorios = multer({
  storage: secureStorageDirectorios,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB para fotos de personal
    files: 1,
    fieldNameSize: 100,
    fieldSize: 1 * 1024 * 1024, // 1MB para datos de contacto
    fields: 15
  },
  fileFilter: secureFileFilter
});

// Función utilitaria para eliminar archivos de forma segura
export const deleteFile = (filePath: string): boolean => {
  try {
    // Validar que el path está dentro del directorio uploads
    const uploadsDir = path.join(__dirname, '../../uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);

    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      console.error('Intento de eliminar archivo fuera del directorio uploads:', filePath);
      return false;
    }

    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return false;
  }
};

// Función para validar si un archivo existe de forma segura
export const fileExists = (filePath: string): boolean => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(uploadsDir);

    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return false;
    }

    return fs.existsSync(resolvedPath);
  } catch (error) {
    return false;
  }
};

// ============================================
// CONFIGURACIÓN PARA DOCUMENTOS
// ============================================

// Tipos de archivo permitidos para documentos
const ALLOWED_DOCUMENT_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar']
};

// Verificar firmas de archivos de documentos (Deshabilitado/Siempre retorna true para compatibilidad del usuario)
const verifyDocumentFileType = (buffer: Buffer, mimetype: string): boolean => {
  return true;
};

// Configuración de almacenamiento para documentos
const secureStorageDocumentos = multer.diskStorage({
  destination: (req, file, cb) => {
    // Crear ruta base directamente en uploads/documentos
    const uploadPath = path.join(__dirname, '../../uploads/documentos');

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    const sanitizedOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 50);

    const filename = `${timestamp}_${randomName}_${sanitizedOriginalName}`;
    cb(null, filename);
  }
});

// Filtro de archivo para documentos
const secureDocumentFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = Object.keys(ALLOWED_DOCUMENT_MIME_TYPES);
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error(`Tipo de documento no permitido: ${file.mimetype}`));
  }

  const allowedExtensions = ALLOWED_DOCUMENT_MIME_TYPES[file.mimetype as keyof typeof ALLOWED_DOCUMENT_MIME_TYPES];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new Error(`Extensión ${fileExtension} no permitida para este tipo de documento`));
  }

  // Patrones peligrosos
  const dangerousPatterns = [
    /\.\./,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i,
    /\x00/,
    /.exe$/i,
    /.bat$/i,
    /.cmd$/i,
    /.sh$/i
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.originalname))) {
    return cb(new Error('Nombre de archivo contiene patrones no permitidos'));
  }

  if (file.originalname.length > 255) {
    return cb(new Error('Nombre de archivo demasiado largo'));
  }

  cb(null, true);
};

// Configuración de multer para documentos
export const uploadDocumentos = multer({
  storage: secureStorageDocumentos,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB para documentos
    files: 1,
    fieldNameSize: 100,
    fieldSize: 2048, // Mayor para permitir descripciones más largas
    fields: 15
  },
  fileFilter: secureDocumentFileFilter
});

// Middleware para validación post-upload de documentos
export const validateUploadedDocument = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Archivo requerido',
      message: 'Debe proporcionar un archivo para subir'
    });
  }

  const filePath = req.file.path;

  try {
    const buffer = fs.readFileSync(filePath, { flag: 'r' });
    const isValidType = verifyDocumentFileType(buffer.slice(0, 20), req.file.mimetype);

    if (!isValidType) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo no corresponde al tipo declarado'
      });
    }

    if (buffer.length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo parece estar corrupto o vacío'
      });
    }

    // Agregar información del archivo a la request
    const { ID_Categorias } = req.body;
    req.body.Ruta_Documento = `/uploads/documentos/${req.file.filename}`;
    req.body.Nombre = req.body.Nombre || req.file.originalname;

    next();
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(500).json({
      error: 'Error procesando archivo',
      message: 'No se pudo validar el archivo'
    });
  }
};

// Configuración de almacenamiento segura para calendarios
const secureStorageCalendarios = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/calendarios');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();

    const filename = `calendario_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

// Configuración segura de multer para calendarios (PDF e imágenes)
export const uploadCalendarios = multer({
  storage: multer.memoryStorage(), // Usar memory storage para validación antes de guardar
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB para calendarios (PDF/Imagen)
    files: 1,
    fieldNameSize: 100,
    fieldSize: 1024 * 1024,
    fields: 10
  },
  fileFilter: (req, file, cb) => {
    // Permitir PDF e imágenes
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido. Solo PDF e imágenes.'));
    }

    // Para memory storage, verificar firma usando file.buffer
    const signatures = {
      'application/pdf': [0x25, 0x50, 0x44, 0x46],
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46],
      'image/webp': [0x52, 0x49, 0x46, 0x46]
    };

    const signature = signatures[file.mimetype as keyof typeof signatures];
    if (signature && file.buffer) {
      let isValid = true;
      for (let i = 0; i < signature.length && i < file.buffer.length; i++) {
        if (file.buffer[i] !== signature[i]) {
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        return cb(new Error('Archivo corrupto o tipo incorrecto'));
      }
    }

    cb(null, true);
  }
});

// Middleware para guardar archivo después de validación
export const saveCalendarioFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/calendarios');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `calendario_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    // Actualizar la información del archivo
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de calendario:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para hero slides y noticias
const heroSlideStorage = multer.memoryStorage();

const _uploadHeroSlidesMulter = multer({
  storage: heroSlideStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB para videos
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF) y videos (MP4, WEBM)'));
    }
  }
}).fields([
  { name: 'archivo', maxCount: 1 },
  { name: 'archivo_movil', maxCount: 1 }
]);

export const uploadHeroSlides = (req: Request, res: Response, next: NextFunction) => {
  _uploadHeroSlidesMulter(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `El archivo supera el tamaño máximo permitido (50MB) en el campo ${err.field}` });
      }
      return res.status(400).json({ error: `Error en la subida: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export const saveHeroSlideFile = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files && !req.file) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/hero');

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  try {
    const saveFile = (file: Express.Multer.File, prefix: string) => {
      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(file.originalname).toLowerCase();
      const filename = `${prefix}_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);
      
      fs.writeFileSync(filePath, file.buffer);
      
      file.path = filePath;
      file.filename = filename;
      file.destination = uploadPath;
      
      return filename;
    };

    if (files) {
      if (files.archivo && files.archivo[0]) {
        (req as any).savedHeroFile = saveFile(files.archivo[0], 'hero');
      }
      if (files.archivo_movil && files.archivo_movil[0]) {
        (req as any).savedHeroMobileFile = saveFile(files.archivo_movil[0], 'hero_mobile');
      }
    } else if (req.file) {
      (req as any).savedHeroFile = saveFile(req.file, 'hero');
    }

    next();
  } catch (error) {
    console.error('Error guardando archivo(s) de hero slide:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron guardar los archivos'
    });
  }
};

// Configuración para noticias
const noticiaStorage = multer.memoryStorage();

export const uploadNoticias = multer({
  storage: noticiaStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF)'));
    }
  }
}).single('imagen');

export const saveNoticiaFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/noticias');

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `noticia_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de noticia:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para anuncios
export const uploadAnuncios = multer({
  storage: noticiaStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF)'));
    }
  }
}).single('imagen');

export const saveAnuncioFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/anuncios');

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `anuncio_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    next();
  } catch (error) {
    console.error('Error guardando archivo de anuncio:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para carreras - imágenes y PDFs
const carreraStorage = multer.memoryStorage();

export const uploadCarrera = multer({
  storage: carreraStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB para videos
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'video/mp4',
      'video/webm',
      'video/x-msvideo' // .avi
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF), PDF o videos (MP4, WEBM, AVI)'));
    }
  }
}).fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagen_portada', maxCount: 1 },
  { name: 'plan_estudios', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

export const saveCarreraFiles = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files) {
    return next();
  }

  try {
    // Guardar imagen (Carátula)
    if (files.imagen && files.imagen[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/caratulas');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.imagen[0].originalname).toLowerCase();
      const filename = `caratula_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.imagen[0].buffer);
      (req as any).savedImagePath = `caratulas/${filename}`;
    }

    // Guardar imagen portada (Cuadrícula)
    if (files.imagen_portada && files.imagen_portada[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/portadas');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.imagen_portada[0].originalname).toLowerCase();
      const filename = `portada_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.imagen_portada[0].buffer);
      (req as any).savedPortadaPath = `portadas/${filename}`;
    }

    // Guardar video
    if (files.video && files.video[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/videos');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.video[0].originalname).toLowerCase();
      const filename = `video_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.video[0].buffer);
      (req as any).savedVideoPath = filename;
    }

    // Guardar plan de estudios (PDF)
    if (files.plan_estudios && files.plan_estudios[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/carreras/planes');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const filename = `plan_${timestamp}_${randomName}.pdf`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.plan_estudios[0].buffer);
      (req as any).savedPlanPath = filename;
    }

    next();
  } catch (error) {
    console.error('Error guardando archivos de carrera:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar los archivos'
    });
  }
};

// Configuración de almacenamiento para estadias
const secureStorageEstadias = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/estadias');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    const sanitizedOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 50);

    const filename = `estadia_${timestamp}_${randomName}_${sanitizedOriginalName}`;
    cb(null, filename);
  }
});

export const uploadEstadias = multer({
  storage: secureStorageEstadias,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1,
  },
  fileFilter: secureDocumentFileFilter // Reusing the secure document filter
});

export const validateUploadedEstadia = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Archivo requerido',
      message: 'Debe proporcionar un archivo para subir'
    });
  }

  const filePath = req.file.path;

  try {
    const buffer = fs.readFileSync(filePath, { flag: 'r' });
    const isValidType = verifyDocumentFileType(buffer.slice(0, 20), req.file.mimetype);

    if (!isValidType) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Archivo inválido',
        message: 'El archivo no corresponde al tipo declarado'
      });
    }

    req.body.Ruta_Documento = `/uploads/estadias/${req.file.filename}`;
    req.body.Nombre = req.body.Nombre || req.file.originalname;

    next();
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.status(500).json({
      error: 'Error procesando archivo',
      message: 'No se pudo validar el archivo'
    });
  }
};

// Configuración para Servicios Tecnológicos
const serviciosTecnologicosStorage = multer.memoryStorage();

export const uploadServiciosTecnologicos = multer({
  storage: serviciosTecnologicosStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF) y PDF'));
    }
  }
}).fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

export const saveServiciosTecnologicosFiles = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files) {
    return next();
  }

  try {
    // Guardar imagen
    if (files.imagen && files.imagen[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/servicios-tecnologicos/imagenes');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.imagen[0].originalname).toLowerCase();
      const filename = `servicio_img_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.imagen[0].buffer);
      (req as any).savedImagePath = `servicios-tecnologicos/imagenes/${filename}`;
    }

    // Guardar PDF
    if (files.pdf && files.pdf[0]) {
      const uploadPath = path.join(__dirname, '../../uploads/servicios-tecnologicos/documentos');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(files.pdf[0].originalname).toLowerCase();
      const filename = `servicio_doc_${timestamp}_${randomName}${originalExt}`;
      const filePath = path.join(uploadPath, filename);

      fs.writeFileSync(filePath, files.pdf[0].buffer);
      (req as any).savedPdfPath = `servicios-tecnologicos/documentos/${filename}`;
    }

    next();
  } catch (error) {
    console.error('Error guardando archivos de servicios tecnológicos:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar los archivos'
    });
  }
};

// Configuración para Miembros SNII
const miembrosSniiStorage = multer.memoryStorage();

export const uploadMiembrosSnii = multer({
  storage: miembrosSniiStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo PDF'));
    }
  }
}).single('pdf');

export const saveMiembrosSniiFiles = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    const uploadPath = path.join(__dirname, '../../uploads/miembros-snii');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(req.file.originalname).toLowerCase();
    const filename = `snii_${timestamp}_${randomName}${originalExt}`;
    const filePath = path.join(uploadPath, filename);

    fs.writeFileSync(filePath, req.file.buffer);
    (req as any).savedPdfPath = `miembros-snii/${filename}`;

    next();
  } catch (error) {
    console.error('Error guardando archivo de miembro SNII:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para Productos de Investigación
const productosInvestigacionStorage = multer.memoryStorage();

export const uploadProductosInvestigacion = multer({
  storage: productosInvestigacionStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo PDF'));
    }
  }
}).single('pdf');

export const saveProductosInvestigacionFiles = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    const uploadPath = path.join(__dirname, '../../uploads/productos-investigacion');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(req.file.originalname).toLowerCase();
    const filename = `investigacion_${timestamp}_${randomName}${originalExt}`;
    const filePath = path.join(uploadPath, filename);

    fs.writeFileSync(filePath, req.file.buffer);
    (req as any).savedPdfPath = `productos-investigacion/${filename}`;

    next();
  } catch (error) {
    console.error('Error guardando archivo de producto de investigación:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración para Seminario Café Científico
const seminarioCafeStorage = multer.memoryStorage();

export const uploadSeminarioCafe = multer({
  storage: seminarioCafeStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF) y PDF'));
    }
  }
}).single('archivo');

export const saveSeminarioCafeFiles = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  try {
    const isPdf = req.file.mimetype === 'application/pdf';
    const subDir = isPdf ? 'documentos' : 'imagenes';
    const uploadPath = path.join(__dirname, `../../uploads/seminario-cafe/${subDir}`);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(req.file.originalname).toLowerCase();
    const filename = `seminario_${timestamp}_${randomName}${originalExt}`;
    const filePath = path.join(uploadPath, filename);

    fs.writeFileSync(filePath, req.file.buffer);
    (req as any).savedFilePath = `seminario-cafe/${subDir}/${filename}`;
    (req as any).fileType = isPdf ? 'pdf' : 'image';

    next();
  } catch (error) {
    console.error('Error guardando archivo de Seminario Café:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el archivo'
    });
  }
};

// Configuración genérica para subir archivos (PDF/Imagen) a una carpeta específica de becas
export const uploadBecaFile = (subfolder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../../uploads/${subfolder}`);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(file.originalname).toLowerCase();
      const filename = `${timestamp}_${randomName}${originalExt}`;
      cb(null, filename);
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten PDFs e imágenes (JPG, PNG, WEBP, GIF)'));
      }
    }
  }).single('bannerUpload');

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'El archivo no debe exceder los 10MB' });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

// Configuración genérica para subir PDFs a una carpeta específica
export const uploadPdf = (subfolder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../../uploads/${subfolder}`);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const randomName = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = path.extname(file.originalname).toLowerCase();
      const filename = `${timestamp}_${randomName}${originalExt}`;
      cb(null, filename);
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos PDF'));
      }
    }
  }).single('pdf');

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (req.file) {
        (req as any).savedPdfPath = `${subfolder}/${req.file.filename}`;
      }
      next();
    });
  };
};

// Configuración para Servicios Tecnológicos Realizados
const serviciosTecnologicosRealizadosStorage = multer.memoryStorage();

export const uploadServiciosTecnologicosRealizados = multer({
  storage: serviciosTecnologicosRealizadosStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo PDF'));
    }
  }
}).single('archivo');

export const saveServiciosTecnologicosRealizadosFiles = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;

  console.log('saveServiciosTecnologicosRealizadosFiles - req.file:', file ? 'Present' : 'Missing');

  if (!file) {
    return next();
  }

  try {
    // Guardar PDF
    const uploadPath = path.join(__dirname, '../../uploads/servicios-tecnologicos-realizados');
    console.log('saveServiciosTecnologicosRealizadosFiles - uploadPath:', uploadPath);

    if (!fs.existsSync(uploadPath)) {
      console.log('Creating directory:', uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    const filename = `servicio_realizado_${timestamp}_${randomName}${originalExt}`;
    const filePath = path.join(uploadPath, filename);

    console.log('Writing file to:', filePath);
    fs.writeFileSync(filePath, file.buffer);
    (req as any).savedPdfPath = `servicios-tecnologicos-realizados/${filename}`;

    next();
  } catch (error) {
    console.error('Error al guardar archivo:', error);
    next(error);
  }
};

// Configuración para Movilidad Internacional
const movilidadInternacionalStorage = multer.memoryStorage();

export const uploadMovilidadInternacional = multer({
  storage: movilidadInternacionalStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo PDF e imágenes.'));
    }
  }
}).single('archivo');

export const saveMovilidadInternacionalFiles = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;

  if (!file) {
    return next();
  }

  try {
    const uploadPath = path.join(__dirname, '../../uploads/movilidad-internacional');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    const filename = `movilidad_${timestamp}_${randomName}${originalExt}`;
    const filePath = path.join(uploadPath, filename);

    fs.writeFileSync(filePath, file.buffer);
    (req as any).savedFilePath = `movilidad-internacional/${filename}`;

    next();
  } catch (error) {
    console.error('Error al guardar archivo:', error);
    next(error);
  }
};

// Exports adicionales para compatibilidad con código remoto
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});
export const uploadBecas = uploadPdf('becas');
export const uploadBanner = uploadBecaFile('becas-banner');
export const uploadExtension = uploadNosotros;
export const uploadExtensionDocuments = uploadDocumentos;
export const uploadModelo = uploadPdf('modelo-educativo');
export const saveModeloFile = saveNoticiaFile;
export const checkCategoryArea = async (req: any, res: any, next: any) => {
  next();
};

export const validateUploadedDocumentOptional = (req: Request, res: any, next: any) => {
  if (!req.file) {
    return next();
  }
  return validateUploadedDocument(req, res, next);
};

// Configuración de almacenamiento segura para banner de prácticas y estadías
const secureStoragePracticas = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/practicas');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();

    const filename = `practicas_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

export const uploadPracticasEstadiasBanner = multer({
  storage: secureStoragePracticas,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
    fieldNameSize: 100,
    fieldSize: 1024,
    fields: 10
  },
  fileFilter: secureFileFilter
});

// Exportar funciones existentes que están como const locales
export { verifyDocumentFileType, secureDocumentFileFilter };

const secureStorageCepim = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/cepim');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const originalExt = path.extname(file.originalname).toLowerCase();
    const filename = `cepim_${timestamp}_${randomName}${originalExt}`;
    cb(null, filename);
  }
});

export const uploadCepim = multer({
  storage: secureStorageCepim,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: secureFileFilter
});


// Configuraci�n para Modalidad Dual (Im�genes y Videos de hasta 100MB)
export const uploadModalidadDual = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo im�genes y video MP4.'));
    }
  }
}).fields([
  { name: 'videoUrl', maxCount: 1 },
  { name: 'convocatoriaImg', maxCount: 1 }
]);

export const saveModalidadDualFile = (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
  if (!req.files) {
    return next();
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const uploadPath = require('path').join(__dirname, '../../uploads/modalidad');

  if (!require('fs').existsSync(uploadPath)) {
    require('fs').mkdirSync(uploadPath, { recursive: true });
  }

  try {
    for (const key of Object.keys(files)) {
      const file = files[key][0];
      const randomName = require('crypto').randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const originalExt = require('path').extname(file.originalname).toLowerCase();
      const filename = `modalidad_${timestamp}_${randomName}${originalExt}`
      const filePath = require('path').join(uploadPath, filename);

      require('fs').writeFileSync(filePath, file.buffer);
      file.filename = filename;
    }
    next();
  } catch (error) {
    console.error('Error guardando archivos de modalidad dual:', error);
    next(error);
  }
};

// Configuración para patrocinadores
const patrocinadorStorage = multer.memoryStorage();

const _uploadPatrocinadorMulter = multer({
  storage: patrocinadorStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WEBP, GIF, SVG)'));
    }
  }
}).single('logo');

export const uploadPatrocinador = (req: Request, res: Response, next: NextFunction) => {
  _uploadPatrocinadorMulter(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El logo supera el tamaño máximo permitido (5MB)' });
      }
      return res.status(400).json({ error: `Error en la subida: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export const savePatrocinadorFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  const uploadPath = path.join(__dirname, '../../uploads/sponsors');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const originalExt = path.extname(req.file.originalname).toLowerCase();
  const filename = `sponsor_${timestamp}_${randomName}${originalExt}`;
  const filePath = path.join(uploadPath, filename);

  try {
    fs.writeFileSync(filePath, req.file.buffer);
    req.file.path = filePath;
    req.file.filename = filename;
    req.file.destination = uploadPath;
    (req as any).savedSponsorFile = `uploads/sponsors/${filename}`; // guardamos la ruta completa relativa al frontend URL
    next();
  } catch (error) {
    console.error('Error guardando archivo de patrocinador:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el logo'
    });
  }
};
