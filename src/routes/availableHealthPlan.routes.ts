import { Router } from 'express';
import {
  createHealthPlan,
  getAllHealthPlans,
  getHealthPlanById,
  updateHealthPlan,
  deleteHealthPlan,
  searchHealthPlanByName,
} from '../controllers/availableHealthPlan.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// router.use(isAuthenticated); // Todas as rotas exigem autenticação
// router.use(isAdmin); // Todas as rotas exigem que o usuário seja admin

router.post('/', isAdmin, createHealthPlan);
router.get('/', isAuthenticated, getAllHealthPlans);
router.get('/:plan_id', isAdmin, getHealthPlanById);
router.put('/:plan_id', isAdmin, updateHealthPlan);
router.delete('/:plan_id', isAdmin, deleteHealthPlan);
router.get('/search/:plan_name', searchHealthPlanByName);

export default router;