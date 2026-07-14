const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Token generado anteriormente
const TOKEN = process.argv[2];

if (!TOKEN) {
  console.error('Por favor proporciona el token como argumento');
  process.exit(1);
}

const API_URL = 'http://localhost:3004/api/movilidad-internacional';

async function testUpload() {
  try {
    // Crear un archivo PDF dummy
    const dummyPdfPath = path.join(__dirname, 'test_movilidad.pdf');
    // Create a valid PDF header to pass magic number check
    const pdfBuffer = Buffer.from('%PDF-1.4\n%\nDummy PDF content for testing.');
    fs.writeFileSync(dummyPdfPath, pdfBuffer);

    const form = new FormData();
    form.append('titulo', 'Documento de Prueba Movilidad');
    form.append('tipo', 'pdf');
    form.append('archivo', fs.createReadStream(dummyPdfPath));
    form.append('activo', 'true');

    console.log('Subiendo documento a ' + API_URL);

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
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
        console.error(error);
    }
  }
}

testUpload();
