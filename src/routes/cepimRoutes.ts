import { Router } from 'express';
import {
    getCepimInfo,
    updateCepimInfo,
    getCepimCards,
    createCepimCard,
    updateCepimCard,
    deleteCepimCard,
    getCepimInfografias,
    createCepimInfografia,
    deleteCepimInfografia
} from '../controllers/CepimController';
import { uploadCepim } from '../middleware/uploadMiddleware';

const router = Router();

// Info Routes
router.get('/info', getCepimInfo);
router.put('/info', uploadCepim.single('imagen'), updateCepimInfo);

// Cards Routes
router.get('/cards', getCepimCards);
router.post('/cards', createCepimCard);
router.put('/cards/:id', updateCepimCard);
router.delete('/cards/:id', deleteCepimCard);

// Infografias Routes
router.get('/infografias', getCepimInfografias);
router.post('/infografias', uploadCepim.single('imagen'), createCepimInfografia);
router.delete('/infografias/:id', deleteCepimInfografia);

export default router;
