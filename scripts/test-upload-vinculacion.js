const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Token generado anteriormente (hardcoded para la prueba)
const TOKEN = process.argv[2];

if (!TOKEN) {
  console.error('Por favor proporciona el token como argumento');
  process.exit(1);
}

const API_URL = 'http://localhost:3002/api/vinculacion-banner';

async function testUpload() {
  try {
    // Crear un archivo PDF dummy
    const dummyPdfPath = path.join(__dirname, 'test_doc.pdf');
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4\nDummy PDF content for testing.');

    const form = new FormData();
    form.append('titulo', 'Documento de Prueba Script');
    form.append('pdf', fs.createReadStream(dummyPdfPath));

    console.log('Subiendo documento...');

    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    console.log('✅ Documento subido exitosamente!');
    console.log('Respuesta:', response.data);

    // Limpiar
    fs.unlinkSync(dummyPdfPath);

  } catch (error) {
    console.error('❌ Error al subir documento:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testUpload();
