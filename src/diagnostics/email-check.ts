// Script de diagnóstico para verificar la configuración de emails
import path from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

function checkProfile(label: string, emailVar: string, keyVar: string) {
  const email = process.env[emailVar];
  const key = process.env[keyVar];

  console.log(`\n📬 Perfil: ${label}`);
  console.log(`   ${emailVar}: ${email ? '✓ Configurada' : '✗ NO configurada'}`);
  console.log(`   ${keyVar}: ${key ? '✓ Configurada' : '✗ NO configurada'}`);
  console.log(`   Estado: ${email && key ? '✅ Listo para enviar' : '❌ NO enviará correos'}`);
}

console.log('🔍 Diagnóstico de configuración de emails\n');

console.log('📧 Variables globales SMTP:');
console.log(`   MAILER_SERVICE: ${process.env.MAILER_SERVICE || '✗ NO configurada'}`);
console.log(`   BASE_URL: ${process.env.BASE_URL || '✗ NO configurada (usará CID)'}`);

checkProfile('Contacto (formulario principal)', 'MAILER_EMAIL_CONTACTO', 'MAILER_SECRET_KEY_CONTACTO');
checkProfile('Trámites escolares', 'MAILER_EMAIL_TRAMITES', 'MAILER_SECRET_KEY_TRAMITES');

const imagePath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail2.jpeg');
console.log('\n🖼️  Imagen de encabezado:');
console.log(`   Ruta: ${imagePath}`);
console.log(`   Existe: ${existsSync(imagePath) ? '✓ SÍ' : '✗ NO'}`);

const mailerService = (process.env.MAILER_SERVICE || '').toLowerCase().trim();
let host = process.env.MAILER_HOST || 'smtp.gmail.com';
let port = parseInt(process.env.MAILER_PORT || '465', 10);
let secure = process.env.MAILER_SECURE === 'true';

if (mailerService === 'office365' || mailerService === 'ofiice365' || mailerService === 'outlook') {
  host = 'smtp.office365.com';
  port = 587;
  secure = false;
} else if (!process.env.MAILER_HOST) {
  host = 'smtp.gmail.com';
  port = 465;
  secure = true;
}

console.log('\n⚙️  Configuración SMTP compartida:');
console.log(`   Servicio detectado: ${mailerService || 'No especificado (usando host)'}`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Secure: ${secure}`);

console.log('\n⚠️  Recordatorios:');
console.log('   • Configura MAILER_EMAIL_CONTACTO y MAILER_EMAIL_TRAMITES con cuentas distintas');
console.log('   • Si usas Gmail con 2FA, necesitas una contraseña de aplicación por cuenta');
console.log('   • El formulario de contacto y los trámites ya usan perfiles SMTP separados');

export { };
