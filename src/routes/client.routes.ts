import { Router } from 'express';
import {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  listClients,
  removeProfessionalFromClient,
} from '../controllers/client.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// Criar cliente
router.post('/', isAuthenticated, createClient);

// Buscar cliente por ID
router.get('/:client_id', isAuthenticated, getClientById);

// Atualizar cliente
router.put('/:client_id', isAuthenticated, updateClient);

// Remover cliente
router.delete('/:client_id', isAuthenticated, deleteClient);

//rota para listar clientes
router.get('/', isAuthenticated, listClients);

//Rota para remover vinculo de profissional com cliente específico
router.delete('/:client_id/professionals/:professional_id', isAuthenticated, removeProfessionalFromClient)

export default router;
