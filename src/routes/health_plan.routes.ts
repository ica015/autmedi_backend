import { Router } from 'express';
import {
  createClientHealthPlan,
  getClientHealthPlans,
  getClientHealthPlanById,
  updateClientHealthPlan,
  deleteClientHealthPlan,
} from '../controllers/health_plan.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// Rota para criar um plano de saúde
router.post('/', isAuthenticated, createClientHealthPlan);

// Rota para listar todos os planos de saúde de um cliente
router.get('/', isAuthenticated, getClientHealthPlans);

// Rota para buscar um plano de saúde por ID
router.get('/:plan_id', isAuthenticated, getClientHealthPlanById);

// Rota para atualizar um plano de saúde
router.put('/:plan_id', isAuthenticated, updateClientHealthPlan);

// Rota para remover um plano de saúde
router.delete('/:plan_id', isAuthenticated, deleteClientHealthPlan);

export default router;