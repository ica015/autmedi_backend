import { Request, Response } from 'express';
import { getUsers, getUserById, getUserByEmail, updateUser, deleteUser  } from '../services/admin.service';

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
    const { email } = req.params;
    if (typeof email !== 'string') {
      res.status(400).json({ error: 'E-mail inválido' });
      return;
    }
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
export const updateUserById = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await updateUser(user_id, { name, email, role });
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