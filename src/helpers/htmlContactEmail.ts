export interface ContactEmailData {
  nombre: string;
  apellidos?: string;
  correo: string;
  telefono?: string;
  miembro?: string;
  matricula?: string;
  mensaje: string;
}

function escapeHtml(text: string): string {
  return text
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
      <td style="padding: 16px 0; border-bottom: ${border};">
        <p style="margin: 0 0 4px; color: #9ca3af; font-size: 11px; font-weight: 500; letter-spacing: 0.3px; text-transform: uppercase;">
          ${label}
        </p>
        <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.5;">
          ${value}
        </p>
      </td>
    </tr>
  `;
}

export default function generateContactEmailHTML(data: ContactEmailData): string {
  const nombreCompleto = escapeHtml(`${data.nombre}${data.apellidos ? ` ${data.apellidos}` : ''}`);
  const correoLink = `<a href="mailto:${escapeHtml(data.correo)}" style="color: #1f2937; text-decoration: underline;">${escapeHtml(data.correo)}</a>`;
  const primerNombre = escapeHtml(data.nombre.split(' ')[0]);

  const fields: string[] = [
    field('Nombre', nombreCompleto),
    field('Correo', correoLink),
    field('Teléfono', escapeHtml(data.telefono || '—')),
    field('Perfil', escapeHtml(data.miembro || '—'), !data.matricula),
  ];

  if (data.matricula) {
    fields.push(field('Matrícula', escapeHtml(data.matricula), true));
  }

  const fecha = new Date().toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contacto Web - UTTECAM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width: 640px; width: 100%; background-color: #ffffff; border: 1px solid #ebebeb;">

          <!-- Header -->
          <tr>
            <td style="padding: 36px 48px 28px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <img src="cid:logo" alt="UTTECAM" width="120" style="display: block; margin: 0 auto 24px; max-width: 120px; height: auto;" />
              <h1 style="margin: 0; color: #111827; font-size: 20px; font-weight: 600; letter-spacing: -0.2px;">
                Nuevo mensaje de contacto
              </h1>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 13px;">
                ${escapeHtml(fecha)}
              </p>
            </td>
          </tr>

          <!-- Datos -->
          <tr>
            <td style="padding: 32px 48px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${fields.join('')}
              </table>
            </td>
          </tr>

          <!-- Mensaje -->
          <tr>
            <td style="padding: 24px 48px 36px;">
              <p style="margin: 0 0 8px; color: #9ca3af; font-size: 11px; font-weight: 500; letter-spacing: 0.3px; text-transform: uppercase;">
                Mensaje
              </p>
              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7;">
                ${formatMessage(data.mensaje)}
              </p>
            </td>
          </tr>

          <!-- Acción -->
          <tr>
            <td style="padding: 0 48px 40px;">
              <a href="mailto:${escapeHtml(data.correo)}" style="display: inline-block; color: #111827; font-size: 13px; font-weight: 500; text-decoration: none; border: 1px solid #d1d5db; padding: 10px 20px;">
                Responder a ${primerNombre} →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 48px; border-top: 1px solid #f0f0f0; text-align: center;">
              <p style="margin: 0; color: #b0b0b0; font-size: 11px; line-height: 1.6;">
                Correo automático · UTTECAM · ${new Date().getFullYear()}
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
