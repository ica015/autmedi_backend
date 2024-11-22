import { Router } from 'express';
import { isAuthenticated , isAdmin} from '../middlewares/auth.middleware';
import { createPricingRule, deletePricingRule, getPricingRuleById, listPricingRules, updatePricingRule } from '../controllers/pricingRule.controller';


const router = Router();

// Rota para criar uma nova regra de preço (POST /api/userpricing)
router.post('/', isAdmin, createPricingRule);

// Rota para buscar todas as regras de preço de um usuário (GET /api/userpricing/:user_id)
router.get('/', isAdmin, listPricingRules);

// Rota para buscar uma regra de preço específica (GET /api/userpricing/:rule_id)
router.get('/:rule_id', isAdmin, getPricingRuleById);

// Rota para atualizar uma regra de preço (PUT /api/userpricing/:rule_id)
router.put('/:rule_id', isAdmin, updatePricingRule);

// Rota para deletar uma regra de preço (DELETE /api/userpricing/:rule_id)
router.delete('/:rule_id', isAdmin, deletePricingRule);

export default router