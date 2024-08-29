import express from 'express';
import { listGuides, countGuides, createGuide, getClientSummary, getClientStats, getAdminSummary, getAdminStats } from '../controllers/guide.controller';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();
router.use( isAuthenticated)

//Rota para criar nova guia
router.post('/', createGuide)
// Rota para listar guias
router.get('/', listGuides);

// Rota para Guias pro cliente e profissional
router.get('/client-summary', getClientSummary)

// Rota para consulta de guias por cliente, plano de saúde e tipo de guias 
router.get('/client-stats', getClientStats)

//Esta rota retorna a quantidade total de guias, separada por cliente, plano de saúde, e profissional. Admins podem ver todas as guias.
router.get('/admin-summary', isAdmin, getAdminSummary)

//Essa rota fornecerá estatísticas detalhadas sobre as guias criadas no sistema, permitindo que os administradores gerem relatórios com filtros específicos por cliente, plano de saúde e profissional.
router.get('/admin-stats', isAdmin, getAdminStats)



// Rota para contar guias
router.get('/count', countGuides);

export default router;