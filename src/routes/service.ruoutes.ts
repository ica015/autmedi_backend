import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service.controller';

const router = express.Router();
router.use(isAuthenticated)

// Rotas para serviços com autenticação
router.post('/', createService);
router.get('/', listServices);
router.get('/:service_id', getServiceById);
router.put('/:service_id', updateService);
router.delete('/:service_id', deleteService);

export default router;
