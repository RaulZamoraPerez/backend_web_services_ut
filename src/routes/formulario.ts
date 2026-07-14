import { Router } from 'express';
import {
  getAllFormularios,
  getFormularioById,
  crearFormulario,
  updateFormularioById,
  deleteFormularioById
} from '../controllers/formularioController';
import { uploadDirectorios } from '../middleware/uploadMiddleware';

const router = Router();

// GET /api/formularios - Obtener todos los formularios
router.get('/', getAllFormularios);

// GET /api/formularios/:id - Obtener un formulario por ID
router.get('/:id', getFormularioById);

// POST /api/formularios - Crear un nuevo formulario
router.post('/', uploadDirectorios.single('archivo'), crearFormulario);

// PUT /api/formularios/:id - Actualizar un formulario
router.put('/:id', uploadDirectorios.single('archivo'), updateFormularioById);

// DELETE /api/formularios/:id - Eliminar un formulario
router.delete('/:id', deleteFormularioById);

export default router;

