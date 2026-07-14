#!/usr/bin/env node

/**
 * Script para probar el acceso a archivos estáticos
 * Ejecutar con: npm run test:files
 */

const https = require('https');
const http = require('http');

// Configuración
const API_HOST = process.env.API_HOST || 'api.uttecam.edu.mx';
const API_PORT = process.env.API_PORT || 443;
const USE_HTTPS = API_PORT == 443;

// Función para hacer petición HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = USE_HTTPS ? https : http;
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: url,
      method: 'GET',
      headers: {
        'User-Agent': 'File-Test-Script/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 100) + (data.length > 100 ? '...' : '')
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Función principal
async function testFiles() {
  console.log('🧪 Probando acceso a archivos estáticos...\n');

  const testUrls = [
    '/uploads/documentos/categoria_5/1761705577631_2359f323c2546217cb8b0c3f6f4180cb_10._Anal__tico_de_la_Deuda_y_Otros_Pasivos.pdf',
    '/api/documentos/check-file/5/1761705577631_2359f323c2546217cb8b0c3f6f4180cb_10._Anal__tico_de_la_Deuda_y_Otros_Pasivos.pdf'
  ];

  for (const url of testUrls) {
    try {
      console.log(`🔍 Probando: ${url}`);
      const result = await makeRequest(url);

      if (result.status === 200) {
        console.log(`✅ ${result.status} - OK`);
        if (url.includes('/api/')) {
          console.log(`📄 Respuesta: ${result.data}`);
        } else {
          console.log(`📎 Archivo encontrado (${result.headers['content-length'] || 'unknown'} bytes)`);
        }
      } else {
        console.log(`❌ ${result.status} - Error`);
        console.log(`📄 Respuesta: ${result.data}`);
      }
    } catch (error) {
      console.log(`❌ Error de conexión: ${error.message}`);
    }
    console.log('');
  }

  console.log('✨ Prueba completada');
}

// Ejecutar
testFiles().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});