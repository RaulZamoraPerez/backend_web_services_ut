import fs from 'fs';
import path from 'path';

/**
 * Asegura que todas las carpetas necesarias para las subidas de archivos
 * existan en el sistema de archivos. Esto evita errores de Multer
 * cuando se intenta subir un archivo a una carpeta que no existe.
 */
export const ensureUploadFolders = (): void => {
    const baseUploads = path.join(__dirname, '../../uploads');

    const folders = [
        '', // Carpeta base uploads/
        'directorios',
        'documentos',
        'calendarios',
        'organigrama',
        'noticias',
        'eventos',
        'anuncios',
        'hero-slides',
        'nosotros',
        'biblioteca',
        'tmp'
    ];

    console.log('📂 Verificando estructura de carpetas de subida...');

    folders.forEach(folder => {
        const targetPath = path.join(baseUploads, folder);
        if (!fs.existsSync(targetPath)) {
            try {
                fs.mkdirSync(targetPath, { recursive: true });
                console.log(` ✅ Carpeta creada: uploads/${folder || '.'}`);
            } catch (err) {
                console.error(` ❌ Error al crear carpeta uploads/${folder}:`, err);
            }
        }
    });
};
