import express, { Router } from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';

// Middleware de seguridad
import { securityHeaders, additionalSecurityHeaders, validateContentType } from './middleware/security';
import { apiRateLimit, speedLimiter } from './middleware/rateLimiter';
import { httpLogging, logUnauthorizedAccess, detectAttackPatterns } from './middleware/logging';
import { sanitizeInput } from './middleware/validation';

// IMPORTACIONES DE RUTAS
import healthRouter from './routes/health';
import textosRouter from './routes/textos';
import normatividadRouter from './routes/quienes-somos/normatividad';
import nosotrosRouter from './routes/nosotros';
import directorioRouter from './routes/directorio';
import authRouter from './routes/auth';
import solicitudConstanciaRouter from './routes/solicitudConstancia';
import routerDocumentos from './routes/Documentos';
import carreraRouter from './routes/carrera';
import heroSlideRouter from './routes/heroSlide';
import eventoRouter from './routes/evento';
import noticiaRouter from './routes/noticia';
import portalDocenteRoutes from './routes/portalDocente';
import portalDocenteDocumentosRoutes from './routes/portalDocenteDocumentosRoutes';
import countdownRoutes from './routes/countdownRoutes';
import anuncioRouter from './routes/anuncio';
import calendarioRouter from './routes/calendario';
import organigramaRouter from './routes/organigrama';
import extensionRouter from './routes/extensionRoutes';
import becasRouter from './routes/becas';
import comiteRouter from './routes/comiteRoutes';
import modalidadDualRoutes from './routes/modalidadDualRoutes';
import programaDesarrolloRouter from './routes/programaDesarrolloRoutes';
/* Dev-only test upload router is dynamically required at runtime to avoid build-time dependency errors when the route file is missing. */
import videoInstitucionalRouter from './routes/videoInstitucional';
import portalEstudiantesRouter from './routes/portalEstudiantes';
import modeloEducativoRouter from './routes/modeloEducativo';
import estadiaRouter from './routes/estadiaRoutes';
import tipoEstadiaRouter from './routes/tipoEstadiaRoutes';
import servicioTecnologicoRouter from './routes/servicioTecnologico';
import miembroSniiRouter from './routes/miembroSnii';
import miembroSniiTipoRouter from './routes/miembroSniiTipoRoutes';
import productoInvestigacionRouter from './routes/productoInvestigacionRoutes';
import seminarioCafeRouter from './routes/seminarioCafeRoutes';
import vinculacionBannerRouter from './routes/vinculacionBannerRoutes';
import practicasEstadiasBannerRouter from './routes/practicasEstadiasBannerRoutes';
import educacionContinuaRouter from './routes/educacionContinuaRoutes';
import servicioSocialRouter from './routes/servicioSocialRoutes';
import servicioSocialTipoRouter from './routes/servicioSocialTipoRoutes';
import servicioTecnologicoRealizadoRouter from './routes/servicioTecnologicoRealizadoRoutes';
import movilidadInternacionalRouter from './routes/movilidadInternacionalRoutes';
import bolsaTrabajoRouter from './routes/bolsaTrabajoRoutes';
import encuentroEgresadosRouter from './routes/encuentroEgresadosRoutes';
import entidadCertificacionEvaluacionRouter from './routes/entidadCertificacionEvaluacionRoutes';
import bibliotecaLinkRouter from './routes/bibliotecaLinkRoutes';
import moodleConfigRouter from './routes/moodleConfig';
import egresadosRouter from './routes/egresadosRoutes';
import footerRouter from './routes/footerRoutes';

import cepimRouter from './routes/cepimRoutes';
import feriasProfesiograficasRouter from './routes/feriasProfesiograficasRoutes';
import promocionInstitucionalRouter from './routes/promocionInstitucionalRoutes';
import visitasGuiadasRouter from './routes/visitasGuiadasRoutes';
import contactConfigRouter from './routes/contactConfigRoutes';
import modalInicialRouter from './routes/modalInicial';
import sitemapRouter from './routes/sitemapRoutes';
import servicioSocialBannerRouter from './routes/servicioSocialBannerRoutes';
import servicioTecnologicoBannerRouter from './routes/servicioTecnologicoBannerRoutes';
import miembrosSniiBannerRouter from './routes/miembrosSniiBannerRoutes';
import repositorioDigitalBannerRouter from './routes/repositorioDigitalBannerRoutes';
import seminarioCafeBannerRouter from './routes/seminarioCafeBannerRoutes';

// Ruta temporal para formularios (puede expandirse luego)

const formularioRouter = Router();
formularioRouter.get('/', (_req, res) => {
  res.json({ mensaje: 'Módulo de formularios disponible próximamente' });
});

// Error handlers
import { notFound, errorHandler } from './middleware/errorHandler';
import EmailRoute from './routes/EmailRoute';
import { ProcesoAdmisionRoute } from './routes/ProcesoAdmision';
import TramitesRoute from './routes/Tramites';
import { FormularioConfigRoute } from './routes/FormularioConfigRoute';
import ConvocatoriaTituloRoute from './routes/ConvocatoriaTitulo';
import PersonalCarreraRoute from './routes/PersonalCarreraRoute';
import CarreraSimpleRoute from './routes/CarreraSimpleRoute';
import OpcionReinscripcionRoute from './routes/OpcionReinscripcionRoute';

const app = express();

// 1. HEADERS DE SEGURIDAD (aplicar primero)
app.use(securityHeaders);
app.use(additionalSecurityHeaders);

// 2. LOGGING HTTP
app.use(httpLogging);

// 3. DETECCIÓN DE ATAQUES
app.use(detectAttackPatterns);

// 4. RATE LIMITING
app.use(apiRateLimit);
app.use(speedLimiter);

// 5. CORS SEGURO
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', // Vite dev server, used by UTTECAM
    'http://localhost:5174',
    'http://localhost:5175',
    'https://api.uttecam.edu.mx',
    'https://uttecam.edu.mx',
    'https://www.uttecam.edu.mx',
    'http://localhost:5174',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'Accept', 'X-Requested-With', 'Cache-Control', 'Pragma'],
  credentials: false, // Importante: no permitir credenciales para mayor seguridad
  maxAge: 86400 // Cache preflight por 24 horas
};

app.use(cors(corsOptions));
// Asegurar que las peticiones preflight OPTIONS respondan correctamente para todas las rutas
app.options('*', cors(corsOptions));

// 6. PARSERS DE BODY (excluir rutas de upload del parsing JSON)
app.use((req, res, next) => {
  // Solo aplicar JSON parser a rutas que no sean de upload
  if (!req.path.includes('/upload-image') && !req.path.includes('/upload') && !req.path.includes('/api/hero-slides')) {
    express.json({
      limit: '1mb',
      strict: true
    })(req, res, next);
  } else {
    next();
  }
});
app.use(express.urlencoded({
  extended: false,
  limit: '1mb'
}));

// 7. VALIDACIÓN DE CONTENT-TYPE
app.use(validateContentType);

// 8. SANITIZACIÓN DE ENTRADA
app.use(sanitizeInput);

// 9. LOGGING DE ACCESOS NO AUTORIZADOS
app.use(logUnauthorizedAccess);

// 10. SERVIR ARCHIVOS ESTÁTICOS DE FORMA SEGURA
// Validación de extensiones antes de servir archivos
const allowedExtensions = [
  // Imágenes
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg',
  // Videos
  '.mp4', '.webm', '.ogg',
  // Documentos
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt',
  // Temporal para hero slides mal guardados
  '.bin'
];

app.use('/uploads',
  // Rate limit para downloads
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // máximo 200 descargas por IP cada 15 minutos
    message: { error: 'Límite de descargas excedido' }
  }),
  // Middleware para validar extensiones ANTES de servir
  (req, res, next) => {
    const filePath = req.path;
    const fileExtension = path.extname(filePath).toLowerCase();

    if (filePath !== '/' && !allowedExtensions.includes(fileExtension)) {
      return res.status(403).json({ error: 'Tipo de archivo no permitido' });
    }
    next();
  },
  express.static(path.join(__dirname, '../uploads'), {
    dotfiles: 'deny', // No servir archivos ocultos
    index: false, // No mostrar índices de directorio
    setHeaders: (res, filePath) => {
      const fileExtension = path.extname(filePath).toLowerCase();

      // Headers de seguridad para archivos estáticos
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

      // Headers específicos para PDFs y documentos
      if (fileExtension === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      } else if (['.doc', '.docx'].includes(fileExtension)) {
        res.setHeader('Content-Type', 'application/msword');
      } else if (['.xls', '.xlsx'].includes(fileExtension)) {
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
      } else if (['.ppt', '.pptx'].includes(fileExtension)) {
        res.setHeader('Content-Type', 'application/vnd.ms-powerpoint');
      }

      // Remove global X-Frame-Options to allow embedding PDF in known clients
      // Note: Helmet sets X-Frame-Options globally; we remove it for uploads only
      try { res.removeHeader('X-Frame-Options'); } catch (e) { /* ignore */ }

      // Allow specific origins to embed documents in an iframe via CSP frame-ancestors
      // This header will override the global CSP set by helmet for this route
      const allowedFrameAncestors = [
        "'self'",
        'https://www.uttecam.edu.mx',
        'https://uttecam.edu.mx',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
      ];
      res.setHeader('Content-Security-Policy', `frame-ancestors ${allowedFrameAncestors.join(' ')};`);

      // Cache diferente según tipo de archivo
      const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'].includes(fileExtension);
      if (isImage) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Imágenes: 1 año
      } else {
        res.setHeader('Cache-Control', 'private, max-age=3600'); // Documentos: 1 hora
      }
    }
  })
);
// Root response: ensure `/` always returns JSON to satisfy cPanel availability checks
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});


// Servir carpeta public también
app.use('/public',
  express.static(path.join(__dirname, '../public'), {
    dotfiles: 'deny',
    index: false,
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  })
);

// 11. RUTA PRINCIPAL CON INFORMACIÓN DE SEGURIDAD
app.get('/', (_req, res) => {
  res.json({
    mensaje: 'API UTTECAM operativa con seguridad OWASP Top 10',
    version: '2.0.0-secure',
    security: {
      authentication: 'JWT Bearer Token required',
      rateLimit: 'Applied',
      headers: 'Security headers enabled',
      cors: 'Restricted origins',
      fileUpload: 'Secure validation enabled'
    },
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      textos: '/api/textos',
      nosotros: '/api/nosotros',
      directorios: '/api/directorios',
      formularios: '/api/formularios',
      solicitudes: '/api/solicitudes-constancia',
      documentos: {
        areas: '/api/documentos/areas',
        categorias: '/api/documentos/categorias',
        archivos: '/api/documentos/archivos',
        estadisticas: '/api/documentos/estadisticas'
      }
    }
  });
});

// 12. HEALTH CHECKS Y MÉTRICAS (PÚBLICAS - sin autenticación)
app.use(healthRouter);

// 13. RUTAS DE AUTENTICACIÓN (PÚBLICAS)
app.use('/api/auth', authRouter);

// 14. RUTAS DE LA API (PROTEGIDAS)
app.use('/api/textos', textosRouter);
app.use('/api/nosotros', nosotrosRouter);
app.use('/api/directorios', directorioRouter);
app.use('/api/formularios', formularioRouter);
app.use('/api/solicitudes-constancia', solicitudConstanciaRouter);
app.use('/api/documentos', routerDocumentos);
app.use('/api/carreras', carreraRouter);
app.use('/api/modalidad-dual', modalidadDualRoutes);
app.use('/api/moodle-config', moodleConfigRouter);
app.use('/api/portal-docente', portalDocenteRoutes);
app.use('/api/portal-docente-documentos', portalDocenteDocumentosRoutes);
app.use('/api/countdowns', countdownRoutes);
app.use('/api/hero-slides', heroSlideRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/noticias', noticiaRouter);
app.use('/api/anuncios', anuncioRouter);
app.use('/api/calendarios', calendarioRouter);
app.use('/api/organigrama', organigramaRouter);
// Keep legacy short path
app.use('/api/extension', extensionRouter);
app.use('/api/becas', becasRouter);
// Backwards compatibility: some clients expect /api/extension-universitaria
app.use('/api/extension-universitaria', extensionRouter);
app.use('/api/video-institucional', videoInstitucionalRouter);
app.use('/api/portal-estudiantes', portalEstudiantesRouter);
app.use('/api/modelo-educativo', modeloEducativoRouter);
app.use('/api/estadias', estadiaRouter);
app.use('/api/tipos-estadia', tipoEstadiaRouter);
app.use('/api/servicios-tecnologicos', servicioTecnologicoRouter);
app.use('/api/miembros-snii', miembroSniiRouter);
app.use('/api/miembros-snii-tipos', miembroSniiTipoRouter);
app.use('/api/productos-investigacion', productoInvestigacionRouter);
app.use('/api/seminarios-cafe', seminarioCafeRouter);
app.use('/api/vinculacion-banner', vinculacionBannerRouter);
app.use('/api/practicas-estadias-banner', practicasEstadiasBannerRouter);
app.use('/api/educacion-continua', educacionContinuaRouter);
app.use('/api/servicio-social', servicioSocialRouter);
app.use('/api/servicio-social-tipos', servicioSocialTipoRouter);
app.use('/api/servicios-tecnologicos-realizados', servicioTecnologicoRealizadoRouter);
app.use('/api/movilidad-internacional', movilidadInternacionalRouter);
app.use('/api/bolsa-trabajo', bolsaTrabajoRouter);
app.use('/api/egresados-encuentros', encuentroEgresadosRouter);
app.use('/api/entidad-certificacion-evaluacion', entidadCertificacionEvaluacionRouter);
app.use('/api/biblioteca-links', bibliotecaLinkRouter);

app.use('/api/servicio-social-banners', servicioSocialBannerRouter);
app.use('/api/servicios-tecnologicos-banners', servicioTecnologicoBannerRouter);
app.use('/api/miembros-snii-banners', miembrosSniiBannerRouter);
app.use('/api/repositorio-digital-banners', repositorioDigitalBannerRouter);
app.use('/api/seminarios-cafe-banners', seminarioCafeBannerRouter);
app.use('/api/egresados', egresadosRouter);
app.use('/api/cepim', cepimRouter);
app.use('/api/ferias-profesiograficas', feriasProfesiograficasRouter);
app.use('/api/promocion-institucional', promocionInstitucionalRouter);
app.use('/api/visitas-guiadas', visitasGuiadasRouter);
app.use('/api/contact-config', contactConfigRouter);
app.use('/api/modal-inicial', modalInicialRouter);
app.use('/api/footer', footerRouter);
app.use('/api/sitemap', sitemapRouter);

app.use('/api/upload', EmailRoute.routes);
app.use('/api/servicios-escolares', ProcesoAdmisionRoute.routes);
app.use('/api/servicios-escolares', TramitesRoute.routes);
app.use('/api/servicios-escolares', ConvocatoriaTituloRoute.routes);
app.use('/api/formularios-config', FormularioConfigRoute.routes);
app.use('/api/personal-carreras', PersonalCarreraRoute);
app.use('/api/carreras-simples', CarreraSimpleRoute);
app.use('/api/opciones-reinscripcion', OpcionReinscripcionRoute);

app.use('/api/quienes-somos/organigrama', organigramaRouter);
app.use('/api/quienes-somos/normatividad', normatividadRouter);
app.use('/api/quienes-somos/calendario', calendarioRouter);
app.use('/api/comites', comiteRouter);
app.use('/api/programas-desarrollo', programaDesarrolloRouter);
// DEV ONLY: test upload endpoints to debug form field counts; not included in production bundles
if (process.env.NODE_ENV !== 'production') {
  try {
    // Require at runtime to avoid TypeScript build errors if the file doesn't exist in production build
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const testUploadRouter = require('./routes/testUpload').default;
    if (testUploadRouter) {
      app.use('/api/_dev/tests/upload', testUploadRouter);
    }
  } catch (err) {
    // If the dev route isn't provided, log a warning and continue without failing the build
    // eslint-disable-next-line no-console
    console.warn('Dev testUpload route not available:', (err as Error)?.message || err);
  }
}


app.use(notFound);
app.use(errorHandler);

export default app;