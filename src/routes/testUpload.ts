import express from 'express';
import { uploadCarrera, uploadNosotros } from '../middleware/uploadMiddleware';

const router = express.Router();

// simple test endpoint to upload form-data to debug field counts, only used in development
router.post('/carreras', uploadCarrera, (req, res) => {
  const fieldsCount = req.body ? Object.keys(req.body).length : 0;
  const filesCount = req.files ? Object.keys(req.files as object).length : 0;
  return res.json({ message: 'DEV upload received', fields: fieldsCount, files: filesCount, body: req.body });
});

router.post('/nosotros', uploadNosotros.single('image'), (req, res) => {
  const fieldsCount = req.body ? Object.keys(req.body).length : 0;
  const filesCount = req.file ? 1 : 0;
  return res.json({ message: 'DEV upload nosotros received', fields: fieldsCount, files: filesCount, body: req.body });
});

export default router;
