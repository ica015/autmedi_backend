import { Request, Response } from 'express';
import { getUsers, getUserById, getUserByEmail, updateUser, deleteUser  } from '../services/admin.service';
import { AuthenticatedRequest } from '../types/express';

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Algo não saiu como esperado' });
      }
  }
};

// Nova função para buscar usuário por ID
export const fetchUserById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const user = await getUserById(user_id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Algo não saiu como esperado' });
    }
  }
};

// Nova função para buscar usuário por e-mail
export const fetchUserByEmail = async (req: Request, res: Response) => {
  try {
    // Acessa o e-mail da query string ou corpo da requisição, dependendo de como a rota é definida
    const { email } = req.query;

    // Verifica se o e-mail é uma string
    if (typeof email !== 'string') {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    // Busca o usuário pelo e-mail
    const user = await getUserByEmail(email);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Algo não saiu como esperado' });
    }
  }
};

// Função para atualizar usuários
export const updateUserById = async (req: AuthenticatedRequest, res: Response) => {
  const { user_id } = req.params;
  const { name, email, rule, cpf_cnpj, address, number, neighborhood, city, state, password } = req.body;
  const currentUser = req.user!; // Usuário autenticado

  try {
    // Verifica se o usuário autenticado tem permissão para atualizar o usuário alvo
    if (currentUser.rule === 'client' && Number(user_id) !== currentUser.user_id) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Prepara os dados para atualização
    const updateData: {
      name?: string;
      email?: string;
      rule?: 'admin' | 'client';
      cpf_cnpj?: string;
      address?: string;
      number?: number;
      neighborhood?: string;
      city?: string;
      state?: string;
      password?: string;
      password_hash?: string;
    } = {
      name,
      email,
      rule,
      cpf_cnpj,
      address,
      number,
      neighborhood,
      city,
      state
    };

    if (password) {
      updateData.password = password;
    }

    // Chama a função de atualização com a lógica de permissões
    const updatedUser = await updateUser(Number(user_id), updateData);

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Algo não saiu como esperado' });
    }
  }
};

//Função para remoção de usuário
export const deleteUserById = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const result = await deleteUser(user_id);
    if (result) {
      res.status(200).json({ message: 'Usuário removido com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Algo não saiu como esperado' });
    }
  }
};