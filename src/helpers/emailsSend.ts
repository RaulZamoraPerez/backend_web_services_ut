import path from 'path';

/**
 * Configuración de la imagen de encabezado del email
 * Si tienes un dominio público, usa BASE_URL en .env
 * Si no, la imagen se adjunta inline con CID
 */
export function getEmailHeaderImage() {
  const imagePath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail2.jpeg');

  // Si tienes BASE_URL configurado, usa la URL pública
  if (process.env.BASE_URL) {
    return {
      type: 'url' as const,
      url: `${process.env.BASE_URL}/emailPhotos/motocleEmail2.jpeg`
    };
  }

  // Si no, adjunta como CID (Content-ID) inline
  return {
    type: 'cid' as const,
    path: imagePath,
    cid: 'headerImage'
  };
}
