import { Router } from 'express';
import { createUserPricing, getUserPricingById, updateUserPricing, deleteUserPricing, listUserPricing } from '../controllers/user_pricing.controller';
import { isAuthenticated , isAdmin} from '../middlewares/auth.middleware';

const router = Router();

// Rota para criar uma fatura
router.post('/', isAdmin, createUserPricing);

// Rota para buscar fatura por ID
router.get('/:id', isAuthenticated, getUserPricingById);

// Rota para atualizar uma fatura
router.put('/:id', isAdmin, updateUserPricing);

// Rota para excluir uma fatura
router.delete('/:id', isAdmin, deleteUserPricing);

// Rota para listar faturas com filtros
router.get('/', isAdmin, listUserPricing);

export default router;
