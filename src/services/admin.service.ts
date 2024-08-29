import { User } from '../models/';

export const getUsers = async () => {
  return await User.findAll({
    order:[
      ['name','asc'],
      ['role','asc']
    ]
  });
};

export const getUserById = async (user_id: string) => {
  return await User.findByPk(user_id);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const updateUser = async (user_id: string, updateData: { name?: string, email?: string, role?: "admin" | "client" }) => {
  const [updated] = await User.update(updateData, {
    where: { user_id }
  });

  if (updated) {
    const updatedUser = await User.findOne({ where: { user_id } });
    return updatedUser;
  }
  return null;
};

export const deleteUser = async (user_id: string) => {
  const deleted = await User.destroy({
    where: { user_id }
  });

  return deleted;
};