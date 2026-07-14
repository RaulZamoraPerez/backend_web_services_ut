// Script para probar la actualización de secciones de Nosotros
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3002';
const JWT_TOKEN = process.env.TEST_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MjU0MDA0MywiZXhwIjoxNzYyNjI2NDQzfQ.kjwlQ67yOKSPBEomXkO_yADYxqOO9Uc-LLXkawpSAqc';

async function testNosotrosUpdate() {
  console.log('🧪 Iniciando pruebas de actualización de Nosotros...\n');

  try {
    // 1. Obtener contenido actual
    console.log('1️⃣  Obteniendo contenido actual...');
    const getResponse = await axios.get(`${API_BASE_URL}/api/nosotros/content`);
    console.log('✅ Contenido obtenido exitosamente');
    console.log('   Visión actual:', getResponse.data.vision?.title);
    console.log('   Misión actual:', getResponse.data.mision?.title);
    console.log('   Valores actual:', getResponse.data.valores?.title);
    console.log('');

    // 2. Actualizar sección de visión
    console.log('2️⃣  Actualizando sección de Visión...');
    const visionUpdate = {
      vision: {
        title: 'VISIÓN',
        description: 'Visión actualizada desde script de prueba - ' + new Date().toLocaleString(),
        imageSrc: getResponse.data.vision?.imageSrc || 'nosotros/vision.jpg'
      }
    };

    const updateResponse = await axios.patch(
      `${API_BASE_URL}/api/nosotros/content/vision`,
      visionUpdate,
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Visión actualizada exitosamente');
    console.log('   Nueva descripción:', updateResponse.data.vision?.description);
    console.log('');

    // 3. Verificar que la actualización se guardó
    console.log('3️⃣  Verificando que los cambios se guardaron...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/api/nosotros/content/vision`);
    
    if (verifyResponse.data.vision?.description === visionUpdate.vision.description) {
      console.log('✅ La actualización se guardó correctamente');
      console.log('   Descripción verificada:', verifyResponse.data.vision.description);
    } else {
      console.log('❌ ERROR: La actualización NO se guardó correctamente');
      console.log('   Esperado:', visionUpdate.vision.description);
      console.log('   Recibido:', verifyResponse.data.vision?.description);
    }
    console.log('');

    // 4. Actualizar sección de valores (array)
    console.log('4️⃣  Actualizando sección de Valores (con array)...');
    const valoresUpdate = {
      valores: {
        title: 'VALORES',
        description: [
          'Valor de prueba 1 - ' + new Date().getTime(),
          'Valor de prueba 2',
          'Valor de prueba 3'
        ],
        imageSrc: getResponse.data.valores?.imageSrc || 'nosotros/valores.jpg'
      }
    };

    const valoresResponse = await axios.patch(
      `${API_BASE_URL}/api/nosotros/content/valores`,
      valoresUpdate,
      {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Valores actualizados exitosamente');
    console.log('   Nuevos valores:', valoresResponse.data.valores?.description);
    console.log('');

    // 5. Verificar valores
    console.log('5️⃣  Verificando valores actualizados...');
    const verifyValoresResponse = await axios.get(`${API_BASE_URL}/api/nosotros/content/valores`);
    
    if (Array.isArray(verifyValoresResponse.data.valores?.description)) {
      console.log('✅ Los valores se guardaron como array correctamente');
      console.log('   Cantidad de valores:', verifyValoresResponse.data.valores.description.length);
    } else {
      console.log('❌ ERROR: Los valores NO son un array');
      console.log('   Tipo recibido:', typeof verifyValoresResponse.data.valores?.description);
    }
    console.log('');

    // 6. Prueba final: obtener todo el contenido
    console.log('6️⃣  Obteniendo todo el contenido actualizado...');
    const finalResponse = await axios.get(`${API_BASE_URL}/api/nosotros/content`);
    console.log('✅ Contenido completo obtenido');
    console.log('   Visión:', finalResponse.data.vision?.description.substring(0, 50) + '...');
    console.log('   Valores:', Array.isArray(finalResponse.data.valores?.description) ? 
      `Array con ${finalResponse.data.valores.description.length} elementos` : 
      'No es un array');
    console.log('');

    console.log('🎉 ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Datos:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Ejecutar pruebas
testNosotrosUpdate();
