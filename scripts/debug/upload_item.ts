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
    console.log('Token received length:', token?.length);

    const filePath = path.join(__dirname, '../../public/Actividades Culturales y Deportivas/Deportivas/VOLEIBOL_1.jpg');
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return;
    }

    const formData = new FormData();
    formData.append('title', 'VOLEIBOL - prueba');
    formData.append('content', 'Taller de voleibol');
    formData.append('image', fs.createReadStream(filePath));

    const headers = { Authorization: `Bearer ${token}`, ...(formData.getHeaders ? formData.getHeaders() : {}) };
    const resp = await axios.post(`${api}/api/extension/sections/talleres-deportivos/items`, formData, { headers });
    console.log('Upload response:', JSON.stringify(resp.data, null, 2));
  } catch (err) {
    console.error('Error in upload:', err);
  }
})();
