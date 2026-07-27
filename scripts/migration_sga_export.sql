-- IDEMPOTENT MIGRATION SCRIPT FOR SGA (Sistema de Gestión Ambiental)
-- Generated on 2026-07-26T02:30:37.436Z
-- Fixed: Collation mix issues by converting columns to utf8mb4 in comparisons

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Ensure Comite record exists for 'sga'
INSERT INTO comites (titulo, slug, descripcion, activo, createdAt, updatedAt)
SELECT 'Sistema de Gestión Ambiental', 'sga', 'Repositorio de Sistema de Gestión Ambiental', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comites WHERE CONVERT(slug USING utf8mb4) = 'sga');

-- Get the Comite ID
SET @comite_id = (SELECT id FROM comites WHERE CONVERT(slug USING utf8mb4) = 'sga' LIMIT 1);

-- 2. Ensure all Category records exist and set variables

-- Category: Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Prensa y Difusión
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Prensa y Difusión', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Prensa y Difusión'
);
SET @cat_id_1 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Prensa y Difusión'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Dirección de Extensión Universitaria
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Dirección de Extensión Universitaria', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Dirección de Extensión Universitaria'
);
SET @cat_id_2 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Dirección de Extensión Universitaria'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Actividades Culturales y Deportivas
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Actividades Culturales y Deportivas', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Actividades Culturales y Deportivas'
);
SET @cat_id_3 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Actividades Culturales y Deportivas'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Subdirección de Difusión y Divulgación Universitaria
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Subdirección de Difusión y Divulgación Universitaria', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Subdirección de Difusión y Divulgación Universitaria'
);
SET @cat_id_4 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Extensión Universitaria || Subdirección de Difusión y Divulgación Universitaria'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Bibliotecarios
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Bibliotecarios', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Bibliotecarios'
);
SET @cat_id_5 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Bibliotecarios'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Estudiantiles
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Estudiantiles', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Estudiantiles'
);
SET @cat_id_6 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Estudiantiles'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Escolares
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Escolares', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Escolares'
);
SET @cat_id_7 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Servicios Escolares || Servicios Escolares'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Financieros y Contabilidad
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Financieros y Contabilidad', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Financieros y Contabilidad'
);
SET @cat_id_8 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Financieros y Contabilidad'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Mantenimiento e Instalaciones
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Mantenimiento e Instalaciones', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Mantenimiento e Instalaciones'
);
SET @cat_id_9 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Mantenimiento e Instalaciones'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Humanos
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Humanos', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Humanos'
);
SET @cat_id_10 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Humanos'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Programación y Presupuesto
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Programación y Presupuesto', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Programación y Presupuesto'
);
SET @cat_id_11 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Programación y Presupuesto'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Materiales y Servicios Generales
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Materiales y Servicios Generales', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Materiales y Servicios Generales'
);
SET @cat_id_12 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Recursos Materiales y Servicios Generales'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Subdirección de  Servicios Administrativos
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Subdirección de  Servicios Administrativos', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Subdirección de  Servicios Administrativos'
);
SET @cat_id_13 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Direccion de Administración y Finanzas || Subdirección de  Servicios Administrativos'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Abogado General
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Abogado General', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Abogado General'
);
SET @cat_id_14 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Abogado General'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria Academica || Apoyo Psicopedagógico
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria Academica || Apoyo Psicopedagógico', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria Academica || Apoyo Psicopedagógico'
);
SET @cat_id_15 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria Academica || Apoyo Psicopedagógico'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria Academica || PIT
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria Academica || PIT', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria Academica || PIT'
);
SET @cat_id_16 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria Academica || PIT'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria Academica || Secretaria Académica
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria Academica || Secretaria Académica', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria Academica || Secretaria Académica'
);
SET @cat_id_17 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria Academica || Secretaria Académica'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria de Vinculación || Practicas y Estadías
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria de Vinculación || Practicas y Estadías', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Practicas y Estadías'
);
SET @cat_id_18 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Practicas y Estadías'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria de Vinculación || Investigación y Desarrollo
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria de Vinculación || Investigación y Desarrollo', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Investigación y Desarrollo'
);
SET @cat_id_19 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Investigación y Desarrollo'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria de Vinculación || Educación Continua
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria de Vinculación || Educación Continua', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Educación Continua'
);
SET @cat_id_20 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Educación Continua'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Secretaria de Vinculación || Desempeño de Egresados
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Secretaria de Vinculación || Desempeño de Egresados', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Desempeño de Egresados'
);
SET @cat_id_21 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Secretaria de Vinculación || Desempeño de Egresados'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Servicios TIC
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Servicios TIC', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Servicios TIC'
);
SET @cat_id_22 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Servicios TIC'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Sistema Integral de Gestión
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Sistema Integral de Gestión', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Sistema Integral de Gestión'
);
SET @cat_id_23 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Subdirección de Planificación y Evaluación || Sistema Integral de Gestión'
  LIMIT 1
);

-- Category: Instrucciones de trabajo || IT Contraloria Interna
INSERT INTO comite_categorias (comite_id, titulo, orden, createdAt, updatedAt)
SELECT @comite_id, 'Instrucciones de trabajo || IT Contraloria Interna', 0, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Contraloria Interna'
);
SET @cat_id_24 = (
  SELECT id FROM comite_categorias 
  WHERE comite_id = @comite_id AND CONVERT(titulo USING utf8mb4) = 'Instrucciones de trabajo || IT Contraloria Interna'
  LIMIT 1
);

-- 3. Insert Documents

-- Document: IT Medios de Expresion.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_1, 'IT Medios de Expresion.pdf', '/uploads/documentos/1785033037446_54e1ebf666f11ddd41c76385700bb6dd_IT_Medios_de_Expresion.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_1 AND CONVERT(titulo USING utf8mb4) = 'IT Medios de Expresion.pdf'
);

-- Document: IT Actividades de Extension Universitaria.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_2, 'IT Actividades de Extension Universitaria.pdf', '/uploads/documentos/1785033037470_c4471fddc9ed1cc1028f1c659b94602d_IT_Actividades_de_Extension_Universitaria_con_la_C.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_2 AND CONVERT(titulo USING utf8mb4) = 'IT Actividades de Extension Universitaria.pdf'
);

-- Document: IT Actividades Culturales y Deportivas.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_3, 'IT Actividades Culturales y Deportivas.pdf', '/uploads/documentos/1785033037495_b344615cb0923b846b18e732540f6d7f_IT_Actividades_Culturales_y_Deportivas.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_3 AND CONVERT(titulo USING utf8mb4) = 'IT Actividades Culturales y Deportivas.pdf'
);

-- Document: IT Difusión y Divulgación.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_4, 'IT Difusión y Divulgación.pdf', '/uploads/documentos/1785033037516_45a7898f6856447adb0debd7be6a347f_IT_Difusion_y_Divulgacion-1.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_4 AND CONVERT(titulo USING utf8mb4) = 'IT Difusión y Divulgación.pdf'
);

-- Document: Matriz de Comunicación.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_4, 'Matriz de Comunicación.pdf', '/uploads/documentos/1785033037539_f69f1ce1a54b463120c6f35d1758079d_Matriz_de_Comunicacion.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_4 AND CONVERT(titulo USING utf8mb4) = 'Matriz de Comunicación.pdf'
);

-- Document: IT Captación de Aspirantes.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_4, 'IT Captación de Aspirantes.pdf', '/uploads/documentos/1785033037551_cd4091f4a424791f9ce7c732bd09f1ec_IT_Captacion_de_Aspirantes-1.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_4 AND CONVERT(titulo USING utf8mb4) = 'IT Captación de Aspirantes.pdf'
);

-- Document: IT Servicios Bibliotecarios.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_5, 'IT Servicios Bibliotecarios.pdf', '/uploads/documentos/1785033037575_469e8694d2f303db4a2bb35738d3a108_IT_Servicios_Bibliotecarios.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_5 AND CONVERT(titulo USING utf8mb4) = 'IT Servicios Bibliotecarios.pdf'
);

-- Document: IT Seguimiento a Convocatorias de Becas Internas y Externas para Estudiantes.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_6, 'IT Seguimiento a Convocatorias de Becas Internas y Externas para Estudiantes.pdf', '/uploads/documentos/1785033037599_ebdba254f6cc2a3e4bf898e10dcb4143_IT_Seguimiento_a_Convocatorias_de_Becas_Internas_y.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_6 AND CONVERT(titulo USING utf8mb4) = 'IT Seguimiento a Convocatorias de Becas Internas y Externas para Estudiantes.pdf'
);

-- Document: IT Tramite de Titulo Profesional Electronico.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_7, 'IT Tramite de Titulo Profesional Electronico.pdf', '/uploads/documentos/1785033037623_f717cff4f56af04a1f32b921118bf96f_IT_Tramite_de_Titulo_Electronico.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_7 AND CONVERT(titulo USING utf8mb4) = 'IT Tramite de Titulo Profesional Electronico.pdf'
);

-- Document: IT Inscripción de Estudiantes.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_7, 'IT Inscripción de Estudiantes.pdf', '/uploads/documentos/1785033037642_252dd8c16b0b4526190018bc6b3d42dc_IT_Inscripcion_de_Estudiantes.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_7 AND CONVERT(titulo USING utf8mb4) = 'IT Inscripción de Estudiantes.pdf'
);

-- Document: IT Acto Protocolario.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_7, 'IT Acto Protocolario.pdf', '/uploads/documentos/1785033037662_d5a7d6f65f88adaaacea259dd7492531_IT_Acto_Protocolario.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_7 AND CONVERT(titulo USING utf8mb4) = 'IT Acto Protocolario.pdf'
);

-- Document: IT CONCILIACIÓN BANCARIA.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_8, 'IT CONCILIACIÓN BANCARIA.pdf', '/uploads/documentos/1785033037677_3ca06c618db5e897012e7774aa261068_IT_CONCILIACION_BANCARIA.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_8 AND CONVERT(titulo USING utf8mb4) = 'IT CONCILIACIÓN BANCARIA.pdf'
);

-- Document: IT Solicitud y Expedición de Cheques y/o Transferencia.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_8, 'IT Solicitud y Expedición de Cheques y/o Transferencia.pdf', '/uploads/documentos/1785033037686_06865d029e64a0c0c53e5f69fef3a688_IT_Solicitud_y_Expedicion_de_Cheques_y_o_Transfere.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_8 AND CONVERT(titulo USING utf8mb4) = 'IT Solicitud y Expedición de Cheques y/o Transferencia.pdf'
);

-- Document: IT Mantenimiento a Instalaciones e Infraestructura.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_9, 'IT Mantenimiento a Instalaciones e Infraestructura.pdf', '/uploads/documentos/1785033037699_d556ee0ed976f315b43746b4feb7f849_IT_Mantenimiento_a_Instalaciones_e_Infraestructura.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_9 AND CONVERT(titulo USING utf8mb4) = 'IT Mantenimiento a Instalaciones e Infraestructura.pdf'
);

-- Document: IT Sistema de Gestión Ambiental Institucional.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_9, 'IT Sistema de Gestión Ambiental Institucional.pdf', '/uploads/documentos/1785033037711_cd9cb63f48f17b24118fa226781a8a63_IT_Sistema_de_Gestion_Ambiental_Institucional.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_9 AND CONVERT(titulo USING utf8mb4) = 'IT Sistema de Gestión Ambiental Institucional.pdf'
);

-- Document: Control Operacional para el Uso Eficiente de la Energia.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_9, 'Control Operacional para el Uso Eficiente de la Energia.pdf', '/uploads/documentos/1785033037727_85302ea4401a27ce753ce26cad58d8d5_Control_Operacional_para_el_Uso_Eficiente_de_la_En.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_9 AND CONVERT(titulo USING utf8mb4) = 'Control Operacional para el Uso Eficiente de la Energia.pdf'
);

-- Document: Control Operacional para el Uso Eficiente del Agua.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_9, 'Control Operacional para el Uso Eficiente del Agua.pdf', '/uploads/documentos/1785033037740_90290da47f82d11de82a7b942174c52a_Control_Operacional_para_el_Uso_Eficiente_del_Agua.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_9 AND CONVERT(titulo USING utf8mb4) = 'Control Operacional para el Uso Eficiente del Agua.pdf'
);

-- Document: Control Operacional para la Recolección de Residuos.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_9, 'Control Operacional para la Recolección de Residuos.pdf', '/uploads/documentos/1785033037752_4ecbabbd866b6072b233eef6835edfa1_Control_Operacional_para_la_Recoleccion_de_Residuo.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_9 AND CONVERT(titulo USING utf8mb4) = 'Control Operacional para la Recolección de Residuos.pdf'
);

-- Document: IT Capacitacion.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_10, 'IT Capacitacion.pdf', '/uploads/documentos/1785033037764_735eeee42fafacb4610cf3de7f531fd5_IT_Capacitacion.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_10 AND CONVERT(titulo USING utf8mb4) = 'IT Capacitacion.pdf'
);

-- Document: IT Reclutamiento, Selección y Contratación de Personal.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_10, 'IT Reclutamiento, Selección y Contratación de Personal.pdf', '/uploads/documentos/1785033037778_5066a9afee1c8ad3fee772a027f375f0_IT_Reclutamiento__Seleccion_y_Contratacion_de_Pers.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_10 AND CONVERT(titulo USING utf8mb4) = 'IT Reclutamiento, Selección y Contratación de Personal.pdf'
);

-- Document: IT Asignación y Comprobación de Viaticos.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_11, 'IT Asignación y Comprobación de Viaticos.pdf', '/uploads/documentos/1785033037792_e75aabcba27444267f500f65c3105d15_IT_Asignacion_y_Comprobacion_de_Viaticos.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_11 AND CONVERT(titulo USING utf8mb4) = 'IT Asignación y Comprobación de Viaticos.pdf'
);

-- Document: IT Asignación Presupuestal.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_11, 'IT Asignación Presupuestal.pdf', '/uploads/documentos/1785033037811_36e5cd79116f878915c9d0437f8bddae_IT_Asignacion_Presupuestal.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_11 AND CONVERT(titulo USING utf8mb4) = 'IT Asignación Presupuestal.pdf'
);

-- Document: IT Adquisición de Materiales.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_12, 'IT Adquisición de Materiales.pdf', '/uploads/documentos/1785033037827_488da2155ddbb53cae3b57b8b9ba046f_IT_Adquisicion_de_Materiales.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_12 AND CONVERT(titulo USING utf8mb4) = 'IT Adquisición de Materiales.pdf'
);

-- Document: IT Prestamo de Auditorios para la realización de eventos institucionales.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_13, 'IT Prestamo de Auditorios para la realización de eventos institucionales.pdf', '/uploads/documentos/1785033037845_afdf9a407d62e80ab8618646e16d677d_IT_Prestamo_de_Auditorios_para_la_realizacion_de_e.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_13 AND CONVERT(titulo USING utf8mb4) = 'IT Prestamo de Auditorios para la realización de eventos institucionales.pdf'
);

-- Document: IT Prestamo y control de unidades del parque vehicular.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_13, 'IT Prestamo y control de unidades del parque vehicular.pdf', '/uploads/documentos/1785033037863_edf935f817a6c10ecc457c999c29002e_IT_Prestamo_y_control_de_unidades_del_parque_vehic.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_13 AND CONVERT(titulo USING utf8mb4) = 'IT Prestamo y control de unidades del parque vehicular.pdf'
);

-- Document: IT Requisitos Legales.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_14, 'IT Requisitos Legales.pdf', '/uploads/documentos/1785033037878_02a99fbb325af3d833a2cce8f538b58d_IT_Requisitos_Legales.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_14 AND CONVERT(titulo USING utf8mb4) = 'IT Requisitos Legales.pdf'
);

-- Document: IT Matriz de requisitos legales ambientales.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_14, 'IT Matriz de requisitos legales ambientales.pdf', '/uploads/documentos/1785033037888_6506898e68d16a082f5307a213fc0e14_Matriz_de_requisitos_legales_ambientales.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_14 AND CONVERT(titulo USING utf8mb4) = 'IT Matriz de requisitos legales ambientales.pdf'
);

-- Document: IT Matriz Institucional de requisitos legales.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_14, 'IT Matriz Institucional de requisitos legales.pdf', '/uploads/documentos/1785033037896_f64434fb0f8f53aebc12bc1e02e4f9b9_Matriz_Institucional_de_requisitos_legales.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_14 AND CONVERT(titulo USING utf8mb4) = 'IT Matriz Institucional de requisitos legales.pdf'
);

-- Document: IT Apoyo Psicopedagógico.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_15, 'IT Apoyo Psicopedagógico.pdf', '/uploads/documentos/1785033037906_149a71b1547279b1c8d0d4098e036d14_IT_Servicio_de_Apoyo_Psicopedagogico.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_15 AND CONVERT(titulo USING utf8mb4) = 'IT Apoyo Psicopedagógico.pdf'
);

-- Document: IT Coordinación del Programa Institucional de Tutorias_PIT.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_16, 'IT Coordinación del Programa Institucional de Tutorias_PIT.pdf', '/uploads/documentos/1785033037927_36de1ccedeb7c6611328f4e0dd843bed_IT_Coordinacion_del_Programa_Institucional_de_Tuto.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_16 AND CONVERT(titulo USING utf8mb4) = 'IT Coordinación del Programa Institucional de Tutorias_PIT.pdf'
);

-- Document: IT Administración del Proceso Enseñanza Apredizaje.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_17, 'IT Administración del Proceso Enseñanza Apredizaje.pdf', '/uploads/documentos/1785033037945_c623f45ae3528e7d61ea7243783a90aa_IT_Administracion_del_Proceso_Ensenanza_Apredizaje.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_17 AND CONVERT(titulo USING utf8mb4) = 'IT Administración del Proceso Enseñanza Apredizaje.pdf'
);

-- Document: IT Asignación y seguimiento de estadias.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_17, 'IT Asignación y seguimiento de estadias.pdf', '/uploads/documentos/1785033037959_6ccaa06deba5a30d1a9bc16dfb5c8fd2_Asignacion_y_Seguimiento_de_Estadias.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_17 AND CONVERT(titulo USING utf8mb4) = 'IT Asignación y seguimiento de estadias.pdf'
);

-- Document: IT PROGRAMACIÓN CUATRIMESTRAL.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_17, 'IT PROGRAMACIÓN CUATRIMESTRAL.pdf', '/uploads/documentos/1785033037968_6e33e47b7b0c08b5c5c00479318c5886_IT_PROGRAMACION_CUATRIMESTRAL.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_17 AND CONVERT(titulo USING utf8mb4) = 'IT PROGRAMACIÓN CUATRIMESTRAL.pdf'
);

-- Document: IT Gestión de Visitas Industriales.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_18, 'IT Gestión de Visitas Industriales.pdf', '/uploads/documentos/1785033037980_f21368b767f6487bc96406fdbfa2faf5_IT_Gestion_de_Visitas_Industriales.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_18 AND CONVERT(titulo USING utf8mb4) = 'IT Gestión de Visitas Industriales.pdf'
);

-- Document: IT Gestión de Estadias.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_18, 'IT Gestión de Estadias.pdf', '/uploads/documentos/1785033037996_34555fe11d551193651adec16f3f55f5_IT_Gestion_de_Estadias.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_18 AND CONVERT(titulo USING utf8mb4) = 'IT Gestión de Estadias.pdf'
);

-- Document: Protocolo de Acción Situaciones Potenciales de Emergencia.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_18, 'Protocolo de Acción Situaciones Potenciales de Emergencia.pdf', '/uploads/documentos/1785033038012_100f7dc7d73214e3b06f062ddc696fc4_Situaciones_Potenciales_de_Emergencia_en_Estadias_.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_18 AND CONVERT(titulo USING utf8mb4) = 'Protocolo de Acción Situaciones Potenciales de Emergencia.pdf'
);

-- Document: IT Servicio Social.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_18, 'IT Servicio Social.pdf', '/uploads/documentos/1785033038022_3bc6dfef19d7f3d8773bd72bf47fec7d_IT_Servicio_Social.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_18 AND CONVERT(titulo USING utf8mb4) = 'IT Servicio Social.pdf'
);

-- Document: IT Actividades de Investigación, Innovación y Desarrollo Tecnologico.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_19, 'IT Actividades de Investigación, Innovación y Desarrollo Tecnologico.pdf', '/uploads/documentos/1785033038037_7c027f74ad19d6468b3691e93f737bfe_Actividades_de_Investigacion__Innovacion_y_Desarro.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_19 AND CONVERT(titulo USING utf8mb4) = 'IT Actividades de Investigación, Innovación y Desarrollo Tecnologico.pdf'
);

-- Document: IT Servicios Tecnologicos.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_19, 'IT Servicios Tecnologicos.pdf', '/uploads/documentos/1785033038046_b036391bd28fc8e62447685a28d61c80_Servicios_Tecnologicos.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_19 AND CONVERT(titulo USING utf8mb4) = 'IT Servicios Tecnologicos.pdf'
);

-- Document: IT Educcion Continua.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_20, 'IT Educcion Continua.pdf', '/uploads/documentos/1785033038057_c7845ddda645491cda3e677f2890418a_IT_Educacion_Continua.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_20 AND CONVERT(titulo USING utf8mb4) = 'IT Educcion Continua.pdf'
);

-- Document: IT Bolsa de Trabajo.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_21, 'IT Bolsa de Trabajo.pdf', '/uploads/documentos/1785033038074_5ea7fe9caceb5eeeef3124cc16f775cc_IT_Bolsa_de_Trabajo.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_21 AND CONVERT(titulo USING utf8mb4) = 'IT Bolsa de Trabajo.pdf'
);

-- Document: IT DESEMPEÑO DE EGRESADOS.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_21, 'IT DESEMPEÑO DE EGRESADOS.pdf', '/uploads/documentos/1785033038087_cc6bb638e864671b74008d03585dfc00_IT_DESEMPENO_DE_EGRESADOS.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_21 AND CONVERT(titulo USING utf8mb4) = 'IT DESEMPEÑO DE EGRESADOS.pdf'
);

-- Document: IT Servicios TIC.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_22, 'IT Servicios TIC.pdf', '/uploads/documentos/1785033038098_75011f26bf70e643881db2b2045f7ade_IT_Servicios_TIC.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_22 AND CONVERT(titulo USING utf8mb4) = 'IT Servicios TIC.pdf'
);

-- Document: Información Documentada.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_23, 'Información Documentada.pdf', '/uploads/documentos/1785033038113_18c42760625cfe69ac5758f9cff01430_INFORMACION_DOCUMENTADA.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_23 AND CONVERT(titulo USING utf8mb4) = 'Información Documentada.pdf'
);

-- Document: Auditorías Internas.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_23, 'Auditorías Internas.pdf', '/uploads/documentos/1785033038133_d7fbbd1a4d2110914e99eef95494b5e2_AUDITORIAS_INTERNAS.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_23 AND CONVERT(titulo USING utf8mb4) = 'Auditorías Internas.pdf'
);

-- Document: Recursos de seguimiento y medición.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_23, 'Recursos de seguimiento y medición.pdf', '/uploads/documentos/1785033038154_fb9ece3786fd9fb4dac0bdf0c7af706b_RECURSOS_DE_SEGUIMIENTO_Y_MEDICION-1.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_23 AND CONVERT(titulo USING utf8mb4) = 'Recursos de seguimiento y medición.pdf'
);

-- Document: Control de las Salidas No Conformes.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_23, 'Control de las Salidas No Conformes.pdf', '/uploads/documentos/1785033038170_368fefca1808d7afe3cc52cde8c35ec6_Control_de_las_Salidas_No_Conformes.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_23 AND CONVERT(titulo USING utf8mb4) = 'Control de las Salidas No Conformes.pdf'
);

-- Document: Procedimiento Mandatorio No Conformidad y Acción Correctiva.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_23, 'Procedimiento Mandatorio No Conformidad y Acción Correctiva.pdf', '/uploads/documentos/1785033038187_add680ccc86097669228f4e1aaf8a392_Procedimiento_Mandatorio_No_Conformidad_y_Accion_C.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_23 AND CONVERT(titulo USING utf8mb4) = 'Procedimiento Mandatorio No Conformidad y Acción Correctiva.pdf'
);

-- Document: Matriz de Roles y Responsabilidades.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_23, 'Matriz de Roles y Responsabilidades.pdf', '/uploads/documentos/1785033038202_78065ff2635236bf825a3f188649d66c_Matriz_de_Roles_y_Responsabilidades.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_23 AND CONVERT(titulo USING utf8mb4) = 'Matriz de Roles y Responsabilidades.pdf'
);

-- Document: IT Gestión de Quejas o Sugerencias.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_24, 'IT Gestión de Quejas o Sugerencias.pdf', '/uploads/documentos/1785033038213_b01477129adaa0da145d849d29707ac0_IT_Gestion_de_Quejas_o_Sugerencias.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_24 AND CONVERT(titulo USING utf8mb4) = 'IT Gestión de Quejas o Sugerencias.pdf'
);

-- Document: Procedimiento para el funcionamiento del Comité de Control y Desempeño Institucional.pdf
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_24, 'Procedimiento para el funcionamiento del Comité de Control y Desempeño Institucional.pdf', '/uploads/documentos/1785033038224_c51a53e6ffb3a36a43b66d6ba5314a3f_IT_Procedimiento_para_el_funcionamiento_del_Comite.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_24 AND CONVERT(titulo USING utf8mb4) = 'Procedimiento para el funcionamiento del Comité de Control y Desempeño Institucional.pdf'
);

-- Document: IT Procedimiento de Actos Entrega-Recepción.PDF
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_24, 'IT Procedimiento de Actos Entrega-Recepción.PDF', '/uploads/documentos/1785033038233_e47673c8a6168a21c796f71efed7ba6c_IT_Procedimiento_de_Actos_Entrega-Recepcion.PDF.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_24 AND CONVERT(titulo USING utf8mb4) = 'IT Procedimiento de Actos Entrega-Recepción.PDF'
);

-- Document: IT Procedimiento para el Funcionamiento de Sesiones de Consejo Directivo.PDF
INSERT INTO documentos_comite (comite_id, categoria_id, titulo, archivo, activo, createdAt, updatedAt)
SELECT @comite_id, @cat_id_24, 'IT Procedimiento para el Funcionamiento de Sesiones de Consejo Directivo.PDF', '/uploads/documentos/1785033038245_5c61fadcf680c6aca82fb814cfa7d787_IT_Procedimiento_para_el_Funcionamiento_de_Sesione.pdf', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_comite 
  WHERE comite_id = @comite_id AND categoria_id = @cat_id_24 AND CONVERT(titulo USING utf8mb4) = 'IT Procedimiento para el Funcionamiento de Sesiones de Consejo Directivo.PDF'
);

SET FOREIGN_KEY_CHECKS = 1;
