import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

(async () => {
  try {
    const api = 'http://localhost:3002';
    const loginRes = await fetch(`${api}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin123!@#' })
    });
    const loginJson = await loginRes.json();
    const token = loginJson.token;

    const filePath = path.join(__dirname, '../../public/Actividades Culturales y Deportivas/Deportivas/TAEKWONDO_3_3.jpg');
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return;
    }

    const formData = new FormData();
    formData.append('title', 'Test Fútbol JSON');
    formData.append('content', 'Actualizando con imagen');
    formData.append('image', fs.createReadStream(filePath));

    const headers = { Authorization: `Bearer ${token}`, ...(formData.getHeaders ? formData.getHeaders() : {}) };
    const res = await axios.put(`${api}/api/extension/items/11`, formData, { headers });
    console.log('Update response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error in update:', err);
  }
})();
