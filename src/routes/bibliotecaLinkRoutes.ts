import { Router } from 'express';
import fileUpload, { Options } from 'express-fileupload';
import {
  getLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink
} from '../controllers/bibliotecaLinkController';
import { getConfig, updateConfig } from '../controllers/bibliotecaConfigController';
import { authenticateToken } from '../middleware/auth';

const uploadOptions: Options = {
  useTempFiles: true,
  tempFileDir: "./temp_uploads",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  abortOnLimit: true,
  responseOnLimit: "El archivo excede el límite de 10 MB.",
  safeFileNames: true,
  preserveExtension: 4,
  createParentPath: true
};

const router = Router();

// Config routes
router.get('/config/info', getConfig);
router.put('/config/info', authenticateToken, fileUpload(uploadOptions), updateConfig);

// Public route to get all links
router.get('/', getLinks);
router.get('/:id', getLinkById);

// Protected routes to manage links
router.post('/', authenticateToken, createLink);
router.put('/:id', authenticateToken, updateLink);
router.delete('/:id', authenticateToken, deleteLink);

export default router;
