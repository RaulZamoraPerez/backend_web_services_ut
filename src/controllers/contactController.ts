import { Request, Response } from 'express';
import path from 'path';
import { ContactConfig } from '../models/ContactConfig';
import generateContactEmailHTML from '../helpers/htmlContactEmail';
import { EmailService } from './email-service/EmailService';

// Obtener la configuración actual
export const getContactConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    let config = await ContactConfig.findOne();
    
    // Crear configuración por defecto si no existe
    if (!config) {
      config = await ContactConfig.create({});
    }
    
    res.json(config);
  } catch (error) {
    console.error('Error fetching contact config:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar la configuración
export const updateContactConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination_email, public_phone, public_email, public_address, title, subtitle, seccion_tag, seccion_titulo, seccion_descripcion } = req.body;
    
    let config = await ContactConfig.findOne();
    
    if (!config) {
      config = await ContactConfig.create({});
    }

    config.destination_email = destination_email ?? config.destination_email;
    config.public_phone = public_phone ?? config.public_phone;
    config.public_email = public_email ?? config.public_email;
    config.public_address = public_address ?? config.public_address;
    config.title = title ?? config.title;
    config.subtitle = subtitle ?? config.subtitle;
    config.seccion_tag = seccion_tag ?? config.seccion_tag;
    config.seccion_titulo = seccion_titulo ?? config.seccion_titulo;
    config.seccion_descripcion = seccion_descripcion ?? config.seccion_descripcion;
    
    await config.save();
    
    res.json(config);
  } catch (error) {
    console.error('Error updating contact config:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Enviar el correo desde el formulario público
export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellidos, correo, telefono, miembro, matricula, mensaje } = req.body;
    
    // Validar datos básicos
    if (!nombre || !correo || !mensaje) {
      res.status(400).json({ error: 'Faltan datos obligatorios' });
      return;
    }

    let config = await ContactConfig.findOne();
    const destEmail = config ? config.destination_email : 'admisiones@uttecam.com';

    const emailService = EmailService.forContact();

    const htmlBody = generateContactEmailHTML({
      nombre,
      apellidos,
      correo,
      telefono,
      miembro,
      matricula,
      mensaje,
    });

    const logoPath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail.png');
    
    const timeId = new Date().toLocaleString('es-MX', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
    
    await emailService.sendEmail({
      to: destEmail,
      subject: `Contacto Web: ${nombre} [${timeId}]`,
      htmlBody,
      attachments: [
        {
          filename: 'logo-uttecam.png',
          path: logoPath,
          cid: 'logo',
          contentType: 'image/png',
        },
      ],
    });

    res.json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error enviando correo de contacto:', error);
    res.status(500).json({ error: 'Error interno al enviar el correo' });
  }
};
