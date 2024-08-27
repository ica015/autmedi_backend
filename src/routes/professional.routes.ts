import { Router } from 'express';
import {
  createProfessional,
  listProfessionalById,
  updateProfessional,
  deleteProfessional,
  listProfessionals
} from '../controllers/professional.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.use(isAuthenticated); // Todas as rotas abaixo requerem autenticação

router.post('/', createProfessional);
router.get('/:professional_id', listProfessionalById);
router.put('/:professional_id', updateProfessional);
router.delete('/:professional_id', deleteProfessional);
router.get('/', listProfessionals); // Listar todos os profissionais associados ao usuário autenticado

export default router;