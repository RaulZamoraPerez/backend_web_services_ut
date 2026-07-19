import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'
import path from 'path';
import fs from 'fs';

export type EmailProfile = 'contact' | 'tramites';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
  contentType?: string;
  cid?: string;
}

interface EmailCredentials {
  email: string;
  secretKey: string;
  fromName: string;
}

const EMAIL_TIMEOUT = 30000;
const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024;

function resolveSmtpConfig() {
  const mailerService = (process.env.MAILER_SERVICE || '').toLowerCase().trim();

  let host = process.env.MAILER_HOST || 'smtp.gmail.com';
  // If port/secure are specified in env, use them, otherwise default to 465/true for Gmail
  let port = process.env.MAILER_PORT ? parseInt(process.env.MAILER_PORT, 10) : 465;
  let secure = process.env.MAILER_SECURE !== undefined ? process.env.MAILER_SECURE === 'true' : true;

  if (mailerService === 'office365' || mailerService === 'ofiice365' || mailerService === 'outlook') {
    host = 'smtp.office365.com';
    port = 587;
    secure = false;
  }

  return { host, port, secure, mailerService };
}

function getEmailCredentials(profile: EmailProfile): EmailCredentials {
  if (profile === 'contact') {
    return {
      email: process.env.MAILER_EMAIL_CONTACTO || '',
      secretKey: process.env.MAILER_SECRET_KEY_CONTACTO || '',
      fromName: 'UTTECAM - Contacto Web',
    };
  }

  return {
    email: process.env.MAILER_EMAIL_TRAMITES || '',
    secretKey: process.env.MAILER_SECRET_KEY_TRAMITES || '',
    fromName: 'UTTECAM - Servicios Escolares',
  };
}

export function isEmailProfileConfigured(profile: EmailProfile): boolean {
  const credentials = getEmailCredentials(profile);
  return Boolean(credentials.email && credentials.secretKey);
}

export class EmailService {
  private transporter: Transporter;
  private logoPath: string;
  private credentials: EmailCredentials;
  private profile: EmailProfile;

  constructor(profile: EmailProfile = 'tramites') {
    this.profile = profile;
    this.credentials = getEmailCredentials(profile);

    if (!this.credentials.email || !this.credentials.secretKey) {
      console.warn(
        `⚠️ Credenciales SMTP no configuradas para perfil "${profile}". ` +
        `Configure MAILER_EMAIL_${profile === 'contact' ? 'CONTACTO' : 'TRAMITES'} ` +
        `y MAILER_SECRET_KEY_${profile === 'contact' ? 'CONTACTO' : 'TRAMITES'} en el .env`
      );
    }

    const { host, port, secure } = resolveSmtpConfig();

    console.log(
      `✉️ Inicializando email [${profile}] (${this.credentials.email || 'sin correo'}) → ${host}:${port}, secure=${secure}`
    );

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: this.credentials.email,
        pass: this.credentials.secretKey,
      },
      connectionTimeout: EMAIL_TIMEOUT,
      greetingTimeout: EMAIL_TIMEOUT,
      socketTimeout: EMAIL_TIMEOUT,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    this.logoPath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail.png');

    if (!fs.existsSync(this.logoPath)) {
      console.warn(`⚠️ Logo institucional no encontrado en: ${this.logoPath}`);
    }
  }

  static forContact(): EmailService {
    return new EmailService('contact');
  }

  static forTramites(): EmailService {
    return new EmailService('tramites');
  }

  static isTramitesConfigured(): boolean {
    return isEmailProfileConfigured('tramites');
  }

  static isContactConfigured(): boolean {
    return isEmailProfileConfigured('contact');
  }

  private validateEmailOptions(options: SendEmailOptions): void {
    if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
      throw new Error('Debe especificar al menos un destinatario');
    }

    if (!options.subject || options.subject.trim().length === 0) {
      throw new Error('El asunto del email es requerido');
    }

    if (!options.htmlBody || options.htmlBody.trim().length === 0) {
      throw new Error('El cuerpo del email es requerido');
    }

    if (options.attachments && options.attachments.length > 0) {
      let totalSize = 0;
      for (const att of options.attachments) {
        if (!fs.existsSync(att.path)) {
          throw new Error(`Archivo adjunto no encontrado: ${att.path}`);
        }
        const stats = fs.statSync(att.path);
        totalSize += stats.size;
      }

      if (totalSize > MAX_ATTACHMENT_SIZE) {
        throw new Error(
          `El tamaño total de los adjuntos (${Math.round(totalSize / 1024 / 1024)}MB) excede el límite de ${MAX_ATTACHMENT_SIZE / 1024 / 1024}MB`
        );
      }
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {
    try {
      this.validateEmailOptions(options);

      if (!this.credentials.email || !this.credentials.secretKey) {
        throw new Error(
          `Servicio de email no configurado para perfil "${this.profile}". ` +
          `Verifique las variables de entorno correspondientes.`
        );
      }

      const userAttachments = (options.attachments || []).filter(
        att => att.filename !== 'header.jpg'
      );

      const attachments: Attachement[] = [];
      if (fs.existsSync(this.logoPath) && !userAttachments.some(att => att.cid === 'logo')) {
        attachments.push({
          filename: 'logo-uttecam.png',
          path: this.logoPath,
          cid: 'logo',
          contentType: 'image/png',
        });
      }

      attachments.push(...userAttachments);

      const mailOptions = {
        from: `${this.credentials.fromName} <${this.credentials.email}>`,
        to: options.to,
        subject: options.subject,
        html: options.htmlBody,
        attachments,
      };

      console.log(
        `📧 [${this.profile}] Enviando email desde ${this.credentials.email} a: ` +
        `${Array.isArray(options.to) ? options.to.join(', ') : options.to}`
      );

      const info = await Promise.race([
        this.transporter.sendMail(mailOptions),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Email timeout: El envío tardó más de 30 segundos')), EMAIL_TIMEOUT)
        ),
      ]);

      console.log(`✅ [${this.profile}] Email enviado exitosamente. MessageId: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error(`❌ [${this.profile}] Error al enviar email:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        from: this.credentials.email,
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      if (!this.credentials.email || !this.credentials.secretKey) {
        return false;
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error(`❌ [${this.profile}] Error al verificar conexión SMTP:`, error);
      return false;
    }
  }
}
