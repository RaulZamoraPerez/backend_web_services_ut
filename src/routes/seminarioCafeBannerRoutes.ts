import { Router } from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/seminarioCafeBannerController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadBannerImage } from '../middleware/bannerUploads';

const router = Router();

router.get('/', getBanners);
router.post('/', authenticateToken, requireAdmin, uploadBannerImage, createBanner);
router.put('/:id', authenticateToken, requireAdmin, uploadBannerImage, updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);

export default router;
