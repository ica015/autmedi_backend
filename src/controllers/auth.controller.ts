import { Request, Response } from 'express';
import { createUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await createUser(name, email, password, role);
    
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Type assertion to Error
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Authenticate user
    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      message: 'Logado com sucesso',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    // Type assertion to Error
    const err = error as Error;
    res.status(401).json({ error: err.message });
  }
};
