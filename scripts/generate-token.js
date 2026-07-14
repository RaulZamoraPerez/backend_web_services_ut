// Script para generar un token JWT válido para pruebas
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ Error: JWT_SECRET no está definido en .env');
  process.exit(1);
}

// Crear un token que expire en 24 horas
const payload = {
  id: 1,
  username: 'admin',
  role: 'admin'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

console.log('🔑 Token JWT generado exitosamente:');
console.log('');
console.log(token);
console.log('');
console.log('📋 Para usar este token, cópialo y úsalo en:');
console.log('   - Headers: Authorization: Bearer [TOKEN]');
console.log('   - O guárdalo en .env como TEST_JWT_TOKEN');
console.log('');
console.log('⏰ El token expira en: 24 horas');
console.log('🔐 Usuario: admin (ID: 1, Role: admin)');
