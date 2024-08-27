import express from 'express';
import {
  createClientProfessional,
  listClientProfessionals,
  updateClientProfessional,
  deleteClientProfessional
} from '../controllers/clientProfessional.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(isAuthenticated)

// Rotas autenticadas
router.post('/client_professionals', createClientProfessional);
router.get('/client_professionals', listClientProfessionals);
router.put('/client_professionals/:client_professional_id', updateClientProfessional);
router.delete('/client_professionals/:client_professional_id', deleteClientProfessional);

export default router;
