import { Request, Response } from 'express';
import { createUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, rule, cpf_cnpj, address, number, neighborhood, city, state } = req.body;

    // Cria o usuário
    const result = await createUser(name, email, password, rule, cpf_cnpj, address, number, neighborhood, city, state);

    // Verifica se houve algum erro, como email ou cpf_cnpj duplicado
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    const user = result.user;

    if (!user) {
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        rule: user.rule,
        cpf_cnpj: user.cpf_cnpj,
        address: user.address,
        number: user.number,
        neighborhood: user.neighborhood,
        city: user.city,
        state: user.state,
      },
    });
  } catch (error) {
    // Asserção de tipo para Error
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
        role: user.rule,
      },
      token,
    });
  } catch (error) {
    // Type assertion to Error
    const err = error as Error;
    res.status(401).json({ error: err.message });
  }
};
