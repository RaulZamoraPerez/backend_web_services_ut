
const fs = require('fs');
const path = require('path');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NTk0NDgwMywiZXhwIjoxNzY2MDMxMjAzfQ.UWP3xQEe8ZJHmETCp6TKtL9f_kuWGSD0v9brguZmG84';

async function run() {
  const filePath = path.join(__dirname, 'test.pdf');
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });

  const formData = new FormData();
  formData.append('titulo', 'Test Servicio');
  formData.append('fecha_realizacion', '2024-01-01');
  formData.append('activo', 'true');
  formData.append('archivo', blob, 'test.pdf');

  try {
    const response = await fetch('http://localhost:3004/api/servicios-tecnologicos-realizados', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Body:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
