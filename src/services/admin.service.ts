import { User } from '../models/';
import bcrypt from 'bcrypt';


export const getUsers = async () => {
  return await User.findAll({
    order:[
      ['name','asc'],
      ['rule','asc']
    ]
  });
};

export const getUserById = async (user_id: string) => {
  return await User.findByPk(user_id);
};

export const getUserByEmail = async (email: string) => {
  try {
    // Busca o usuário pelo e-mail
    return await User.findOne({ where: { email } });
  } catch (error) {
    if (error instanceof Error)
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

export const updateUser = async (
  user_id: number,
  updateData: {
  name?: string;
  email?: string;
  password?: string;
  password_hash?: string;
  rule?: 'admin' | 'client';
  cfp_cnpj?: string;
  address?: string;
  number?: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  }
) => {
  // Se a senha estiver no updateData, faça o hash antes de atualizar
  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password_hash = hashedPassword;
    delete updateData.password; // Remove o campo senha não hash
  }

  // Atualiza o usuário
  const [updated] = await User.update(updateData, {
    where: { user_id },
    returning: true, // Se usar um banco de dados que suporta `returning`
  });

  if (updated) {
    return User.findOne({ where: { user_id } });
  }
  return null;
};


export const deleteUser = async (user_id: string) => {
  const deleted = await User.destroy({
    where: { user_id }
  });

  return deleted;
};

