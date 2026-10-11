export interface QuejaEmailData {
  folio: string;
  tipo: string;
  tipo_otro_texto?: string | null;
  nombre_completo: string;
  correo: string;
  telefono: string;
  carrera_area: string;
  fecha: string;
  descripcion: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMessage(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br/>');
}

function field(label: string, value: string, isLast = false) {
  const border = isLast ? 'none' : '1px solid #f0f0f0';
  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: ${border};">
        <p style="margin: 0 0 4px; color: #64748b; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
          ${label}
        </p>
        <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.5; font-weight: 500;">
          ${value}
        </p>
      </td>
    </tr>
  `;
}

export default function generateQuejaEmailHTML(data: QuejaEmailData): string {
  const nombre = escapeHtml(data.nombre_completo);
  const correoLink = `<a href="mailto:${escapeHtml(data.correo)}" style="color: #189984; text-decoration: underline; font-weight: 600;">${escapeHtml(data.correo)}</a>`;
  const telefonoLink = `<a href="tel:${escapeHtml(data.telefono)}" style="color: #1e293b; text-decoration: none;">${escapeHtml(data.telefono)}</a>`;
  
  const tipoLabel = data.tipo === 'Otro' && data.tipo_otro_texto 
    ? `Otro (${data.tipo_otro_texto})` 
    : data.tipo;

  const tipoBadgeColor = data.tipo === 'Queja' 
    ? 'background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' 
    : data.tipo === 'Sugerencia'
    ? 'background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;'
    : 'background-color: #fff7ed; color: #ea580c; border: 1px solid #ffedd5;';

  const fields: string[] = [
    field('Folio de Seguimiento', `<strong style="font-family: monospace; font-size: 16px; color: #189984; letter-spacing: 1px;">${escapeHtml(data.folio)}</strong>`),
    field('Tipo de Solicitud', `<span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 700; ${tipoBadgeColor}">${escapeHtml(tipoLabel)}</span>`),
    field('Nombre Completo', nombre),
    field('Correo Electrónico', correoLink),
    field('Teléfono de Contacto', telefonoLink),
    field('Carrera / Área Involucrada', escapeHtml(data.carrera_area)),
    field('Fecha Reportada', escapeHtml(data.fecha), true),
  ];

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Buzón de Quejas y Sugerencias - UTTECAM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

          <!-- Encabezado Institucional -->
          <tr>
            <td style="background: linear-gradient(135deg, #189984 0%, #116e5f 100%); padding: 32px 40px; text-align: center;">
              <img src="cid:logo" alt="UTTECAM" width="110" style="display: block; margin: 0 auto 16px; max-width: 110px; height: auto;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">
                Buzón de Quejas y Sugerencias
              </h1>
              <p style="margin: 6px 0 0; color: #e2fdf7; font-size: 13px; font-weight: 500;">
                Universidad Tecnológica de Tecamachalco
              </p>
            </td>
          </tr>

          <!-- Folio Banner -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 14px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #475569; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Folio Registrado: </span>
              <strong style="color: #0f172a; font-size: 15px; font-family: monospace; letter-spacing: 1px;">${escapeHtml(data.folio)}</strong>
            </td>
          </tr>

          <!-- Campos de Información -->
          <tr>
            <td style="padding: 28px 40px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${fields.join('')}
              </table>
            </td>
          </tr>

          <!-- Sección de Evidencia si existe -->
          ${data.hasAttachment ? `
          <tr>
            <td style="padding: 0 40px 16px;">
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px;">
                <p style="margin: 0 0 4px; color: #166534; font-size: 13px; font-weight: 700;">
                  📎 Evidencia Adjunta: <span style="font-weight: 600; color: #14532d;">${escapeHtml(data.attachmentName || 'Archivo')}</span>
                </p>
                <p style="margin: 0; color: #15803d; font-size: 12px;">
                  El archivo se encuentra adjunto a este correo electrónico para su descarga y consulta.
                </p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Sección de Descripción -->
          <tr>
            <td style="padding: 12px 40px 28px;">
              <div style="background-color: #f8fafc; border-left: 4px solid #189984; border-radius: 6px; padding: 20px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px; color: #334155; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  Descripción Detallada:
                </p>
                <div style="color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">
                  ${formatMessage(data.descripcion)}
                </div>
              </div>
            </td>
          </tr>

          <!-- Aviso de Término y Confidencialidad -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px;">
                <p style="margin: 0 0 6px; color: #92400e; font-size: 12px; font-weight: 700;">
                  ⚠️ Información de Gestión y Términos Institucionales:
                </p>
                <ul style="margin: 0; padding-left: 18px; color: #78350f; font-size: 12px; line-height: 1.5;">
                  <li>Los datos proporcionados son confidenciales y de uso exclusivo para dar atención a la solicitud.</li>
                  <li>El término institucional de respuesta es de <strong>3 a 5 días hábiles</strong> por parte del área responsable.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 11px;">
                Este es un mensaje generado automáticamente por el Sistema del Portal Institucional de la UTTECAM.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}
