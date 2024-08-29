// routes/materials.routes.ts
import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware'; // Middleware de autenticação
import {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial
} from '../controllers/materials.controller';

const router = Router();

router.use(isAuthenticated)
// Rotas protegidas por autenticação
router.post('/api/materials', createMaterial);
router.get('/api/materials', getMaterials);
router.get('/api/materials/:id', getMaterialById);
router.put('/api/materials/:id', updateMaterial);
router.delete('/api/materials/:id', deleteMaterial);

export default router;
