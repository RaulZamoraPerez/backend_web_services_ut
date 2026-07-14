import { FormType } from "../types/formType";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMultiline(text: string): string {
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

export default function generateEmailHTML(data: FormType, tituloFormulario?: string): string {
  const titulo = escapeHtml(tituloFormulario || 'Trámite');

  const fieldDefs: { label: string; value?: string; isHtml?: boolean }[] = [
    { label: 'Nombre completo', value: data.nombre },
    { label: 'Matrícula', value: data.matricula },
    { label: 'Correo electrónico', value: data.email, isHtml: true },
    { label: 'Teléfono', value: data.telefono },
    { label: 'Carrera', value: data.carrera },
    { label: 'Nivel', value: data.nivel },
    { label: 'Fecha de entrega', value: data.entrega },
    { label: 'Documentos solicitados', value: data['documentos-solicitados'] },
    { label: 'Referencia de pago', value: data.referencia },
    { label: 'Número de seguro', value: data['numero-seguro'] },
    { label: 'Comentarios adicionales', value: data.comentarios, isHtml: true },
  ];

  const activeFields = fieldDefs.filter(f => f.value);

  const rows = activeFields.map((item, index) => {
    const isLast = index === activeFields.length - 1;
    let displayValue: string;

    if (item.label === 'Correo electrónico' && item.value) {
      displayValue = `<a href="mailto:${escapeHtml(item.value)}" style="color: #1f2937; text-decoration: underline;">${escapeHtml(item.value)}</a>`;
    } else if (item.isHtml && item.value) {
      displayValue = formatMultiline(item.value);
    } else {
      displayValue = escapeHtml(item.value!);
    }

    return field(item.label, displayValue, isLast);
  });

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
  <title>Solicitud de Trámite - UTTECAM</title>
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
                ${titulo}
              </h1>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 13px;">
                Servicios Escolares · ${escapeHtml(fecha)}
              </p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Nueva solicitud recibida desde el portal en línea:
              </p>
            </td>
          </tr>

          <!-- Datos -->
          <tr>
            <td style="padding: 24px 48px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows.join('')}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 48px; border-top: 1px solid #f0f0f0; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                Correo automático · No respondas a este mensaje
              </p>
              <p style="margin: 8px 0 0; color: #b0b0b0; font-size: 11px; line-height: 1.6;">
                UTTECAM · Servicios Escolares · ${new Date().getFullYear()}
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
