import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt';


export const createUser = async (name: string, email: string, password: string, rule: 'admin' | 'client', cpf_cnpj: string, address: string, number: number, neighborhood: string, city: string, state: string) => {
  // Verifica se o email já está cadastrado
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return { success: false, message: 'O email já está cadastrado.' };
  }

  // Verifica se o cpf_cnpj já está cadastrado
  const existingCpfCnpj = await User.findOne({ where: { cpf_cnpj } });
  if (existingCpfCnpj) {
    return { success: false, message: 'O CPF/CNPJ já está cadastrado.' };
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria o novo usuário
  const user = await User.create({
    name,
    email,
    password_hash: hashedPassword,
    rule,
    cpf_cnpj,
    address,
    number,
    neighborhood,
    city,
    state,
  });

  return { success: true, user };
};


export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ user_id: user.user_id, rule: user.rule }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { user, token };
};
