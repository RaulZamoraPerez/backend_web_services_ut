-- database_setup.sql
-- Script inicial para crear tablas mínimas necesarias para un deployment funcional
-- NOTA: Este script incluye tablas básicas (textos) y referencia a otros scripts en /sql/
-- Ejecute este archivo en phpMyAdmin o desde la terminal MySQL:
-- mysql -u TU_USUARIO -p TU_BASE_DE_DATOS < sql/database_setup.sql

-- Tabla básica: textos (usada por endpoints públicos)
CREATE TABLE IF NOT EXISTS `textos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `contenido` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Puedes ejecutar, si lo deseas, los scripts individuales contenidos en /sql/ para añadir tablas adicionales.
-- Ejemplo: ejecutar los archivos que vienen con el proyecto:
--   source sql/home_content_setup.sql;
--   source sql/solicitudes_constancias_kardex.sql;

-- Datos de ejemplo (opcional):
INSERT INTO `textos` (contenido) VALUES
('Bienvenido a la Universidad Tecnológica de Tecamachalco'),
('La UTTECAM se compromete con la excelencia académica');
