import sequelize from '../src/config/database';
import { QueryTypes } from 'sequelize';
import ExtensionItem from '../src/models/ExtensionItem';
import ExtensionDocument from '../src/models/ExtensionDocument';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida (raw)');

    // Check columns
    const [colsResult] = (await sequelize.query("SHOW COLUMNS FROM extension_sections LIKE 'is_enabled'")) as any;
    const hasIsEnabled = Array.isArray(colsResult) && colsResult.length > 0;

    const sections = [
      { slug: 'talleres-culturales', title: 'Talleres Culturales', description: 'Desarrolla tu creatividad y talento artístico en nuestros talleres especializados', banner_url: "/public/Actividades Culturales y Deportivas/Culturales/BANNER DEPORTIVOS CULTURALES_UTTECAM.jpg" },
      { slug: 'talleres-deportivos', title: 'Talleres Deportivos', description: 'Fomenta tu salud y espíritu competitivo en nuestros talleres deportivos', banner_url: "/public/Actividades Culturales y Deportivas/Deportivas/BANNER DEPORTIVOS_UTTECAM 1-01.jpg" },
      { slug: 'servicio-medico', title: 'Servicio Médico', description: 'Atención médica y primeros auxilios', banner_url: "/public/ExtensionUniversitaria/ServicioMedico/SERVICIO MÉDICO.jpg" },
      { slug: 'ferias-profesiograficas', title: 'Ferias Profesiográficas', description: 'Conoce las oportunidades de empleo y prácticas empresariales', banner_url: "/public/ExtensionUniversitaria/DifusionyDivulgacion/Ferias/BANNER_FERIAS.jpg" },
      { slug: 'visitas-guiadas', title: 'Visitas Guiadas', description: 'Visitas guiadas para conocer la infraestructura y proyectos de UTTECAM', banner_url: "/public/ExtensionUniversitaria/DifusionyDivulgacion/Visitas/BANNER_VISITAS.jpg" }
    ];

    for (const s of sections) {
      const rows = (await sequelize.query('SELECT id, slug, title, banner_url ' + (hasIsEnabled ? ', is_enabled ' : '') + 'FROM extension_sections WHERE slug = ?', { replacements: [s.slug], type: QueryTypes.SELECT })) as any[];
      let sectionId: number | null = null;
      if (rows.length === 0) {
        // Insert
        if (hasIsEnabled) {
          const insertSql = 'INSERT INTO extension_sections (slug, title, description, banner_url, is_enabled, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
          const result = await sequelize.query(insertSql, { replacements: [s.slug, s.title, s.description, s.banner_url, true], type: QueryTypes.INSERT });
          // result returns [insertId, affectedRows]
          // For mysql2, result[0] might be insertId
          // We'll fetch by slug to be safe
        } else {
          const insertSql = 'INSERT INTO extension_sections (slug, title, description, banner_url, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
          await sequelize.query(insertSql, { replacements: [s.slug, s.title, s.description, s.banner_url], type: QueryTypes.INSERT });
        }
        const newRows = (await sequelize.query('SELECT id FROM extension_sections WHERE slug = ?', { replacements: [s.slug], type: QueryTypes.SELECT })) as any[];
        if (newRows.length > 0) sectionId = newRows[0].id;
        console.log(`✅ Sección creada (raw): ${s.title}`);
      } else {
        sectionId = rows[0].id;
        // update banner if needed
        if (rows[0].banner_url !== s.banner_url) {
          await sequelize.query('UPDATE extension_sections SET banner_url = ?, updated_at = NOW() WHERE id = ?', { replacements: [s.banner_url, sectionId], type: QueryTypes.UPDATE });
          console.log(`🔄 Banner actualizado para (raw): ${s.title}`);
        }
        if (hasIsEnabled && rows[0].is_enabled !== 1) {
          await sequelize.query('UPDATE extension_sections SET is_enabled = 1, updated_at = NOW() WHERE id = ?', { replacements: [sectionId], type: QueryTypes.UPDATE });
          console.log(`🔄 Sección habilitada (raw): ${s.title}`);
        }
      }

      if (sectionId == null) {
        console.warn(`⚠️ No se pudo determinar id para la sección ${s.slug}; saltando items`);
        continue;
      }

      // Items: create if none
      const itemsExisting = await sequelize.query('SELECT id FROM extension_items WHERE section_id = ?', { replacements: [sectionId], type: QueryTypes.SELECT }) as any[];
      if (itemsExisting.length === 0) {
        const sampleItems: any = {
          'talleres-culturales': [ { title: 'Taller de Dibujo', content: 'Clases semanales de dibujo artístico' }, { title: 'Taller de Teatro', content: 'Sesiones prácticas y obra final' } ],
          'talleres-deportivos': [ { title: 'Fútbol', content: 'Entrenamientos y torneos internos' }, { title: 'Atletismo', content: 'Programa de acondicionamiento y pruebas' } ],
          'servicio-medico': [ { title: 'Atención general', content: 'Servicios básicos y primeros auxilios' }, { title: 'Campañas de salud', content: 'Jornadas preventivas y consultas' } ],
          'ferias-profesiograficas': [ { title: 'Próxima Feria', content: 'Regístrate y conoce empresas participantes' } ],
          'visitas-guiadas': [ { title: 'Visita al Laboratorio', content: 'Conoce las instalaciones de investigación' } ]
        };
        for (const it of (sampleItems[s.slug]||[])) {
          await sequelize.query('INSERT INTO extension_items (section_id, title, content) VALUES (?, ?, ?)', { replacements: [sectionId, it.title, it.content], type: QueryTypes.INSERT });
          console.log(`🆕 Item creado (raw): ${it.title} en sección ${s.title}`);
        }
      } else {
        console.log(`ℹ️ La sección ${s.title} ya tiene ${itemsExisting.length} items`);
      }
    }

    // Seed documents for promos/gacetas if empty
    const promoExists = (await sequelize.query("SELECT id FROM extension_documents WHERE category = 'promocion' LIMIT 1", { type: QueryTypes.SELECT })) as any[];
    if (promoExists.length === 0) {
      await sequelize.query("INSERT INTO extension_documents (category, title, file_url, publication_date, mime_type, media_type, created_at) VALUES ('promocion','Flyer Promoción 2025','/public/ExtensionUniversitaria/DifusionyDivulgacion/promocion/Flyer_Promo_2025.jpg', NOW(), 'image/jpeg','image', NOW())", { type: QueryTypes.INSERT });
      console.log('🆕 Documento de promoción creado (raw)');
    }

    const gacetaExists = (await sequelize.query("SELECT id FROM extension_documents WHERE category = 'gacetas' LIMIT 1", { type: QueryTypes.SELECT })) as any[];
    if (gacetaExists.length === 0) {
      await sequelize.query("INSERT INTO extension_documents (category, title, file_url, publication_date, mime_type, media_type, created_at) VALUES ('gacetas','Gaceta Abril 2025','/public/ExtensionUniversitaria/Prensa y difusion/Gaceta_Abril_2025.pdf', NOW(), 'application/pdf','document', NOW())", { type: QueryTypes.INSERT });
      console.log('🆕 Gaceta creada (raw)');
    }

    console.log('✅ Seeding raw completado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed (raw):', err);
    process.exit(1);
  }
};

seed();
