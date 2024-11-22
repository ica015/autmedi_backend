import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type checkPasswordCallBack = (err?: Error | undefined, isSame?: boolean) => void;

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  checkPassword: (password: string, callbackfn: checkPasswordCallBack) => void;
}

interface UserAttributes {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  rule: 'admin' | 'client'; // Alterado de 'role' para 'rule'
  cpf_cnpj?: string; // Novo campo
  address?: string; // Novo campo
  number?: number; // Novo campo
  neighborhood?: string; // Novo campo
  city?: string; // Novo campo
  state?: string; // Novo campo
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' |'created_at'|'updated_at' > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public rule!: 'admin' | 'client'; // Alterado de 'role' para 'rule'
  public cpf_cnpj?: string; // Novo campo
  public address?: string; // Novo campo
  public number?: number; // Novo campo
  public neighborhood?: string; // Novo campo
  public city?: string; // Novo campo
  public state?: string; // Novo campo
  public created_at!: Date;
  public updated_at!: Date;
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rule: { // Alterado de 'role' para 'rule'
    type: DataTypes.ENUM('admin', 'client'),
    allowNull: false,
  },
  cpf_cnpj: { // Novo campo
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address: { // Novo campo
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  number: { // Novo campo
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  neighborhood: { // Novo campo
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  city: { // Novo campo
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  state: { // Novo campo
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

export default User;
