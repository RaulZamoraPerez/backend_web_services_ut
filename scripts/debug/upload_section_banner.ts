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

    const filePath = path.join(__dirname, '../../public/Actividades Culturales y Deportivas/Culturales/TEATRO_4.jpg');
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return;
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const headers = { Authorization: `Bearer ${token}`, ...(formData.getHeaders ? formData.getHeaders() : {}) };
    const res = await axios.post(`${api}/api/extension/sections/talleres-culturales/upload-image`, formData, { headers });
    console.log('Upload banner response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error in upload banner:', err);
  }
})();
