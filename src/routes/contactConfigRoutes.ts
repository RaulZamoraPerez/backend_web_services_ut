import { Router } from 'express';
import { getContactConfig, updateContactConfig, sendContactEmail } from '../controllers/contactController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getContactConfig);
router.put('/', authenticateToken, updateContactConfig);
router.post('/send', sendContactEmail);

export default router;
