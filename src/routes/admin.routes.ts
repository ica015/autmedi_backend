import { Router } from 'express';
import { deleteUserById, fetchUserByEmail, fetchUserById, fetchUsers, updateUserById } from '../controllers/admin.controller';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';


const router = Router();

router.use(isAdmin); // Todas as rotas exigem que o usuário seja admin

// Rota para buscar todos os usuários
router.get('/', fetchUsers);

// Rota para buscar usuário por ID
router.get('/:user_id', fetchUserById);

// Rota para buscar usuário por e-mail
router.get('/email/:email', fetchUserByEmail);

// Rota para atualizar usuário por ID
router.put('/:user_id', updateUserById);

// Rota para remover usuário por ID
router.delete('/:user_id', deleteUserById);

export default router;