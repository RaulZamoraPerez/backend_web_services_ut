import { Router } from 'express';
import { getSiteConfig, updateSiteConfig } from '../controllers/siteConfigController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Ruta pública — el sitio web la consume al cargar
router.get('/', getSiteConfig);

// Ruta protegida — solo el dashboard admin puede modificarla
router.put('/', authenticateToken, updateSiteConfig);

export default router;
