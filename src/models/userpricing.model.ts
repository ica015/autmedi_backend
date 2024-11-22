import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; // ajuste o caminho conforme necessário

// Definição dos atributos do modelo
interface UserPricingAttributes {
  payment_id: number;
  user_id: number;
  amount: number;
  payment_date: Date;
  due_date: Date;
  contract_start_date: Date;
  contract_end_date: Date;
  transaction_id: string;
  comments?: string; // Novo campo opcional
  status: 'paid' | 'pending' | 'late'; // Adicionado 'late'
  created_at?: Date;
  updated_at?: Date;
}

// Definição dos atributos opcionais para criação e atualização
export interface UserPricingCreationAttributes extends Optional<UserPricingAttributes, 'payment_id' | 'payment_date' | 'comments' | 'created_at' | 'updated_at'> {}

// Modelo UserPricing
export class UserPricing extends Model<UserPricingAttributes, UserPricingCreationAttributes> implements UserPricingAttributes {
  public payment_id!: number;
  public user_id!: number;
  public amount!: number;
  public payment_date!: Date;
  public due_date!: Date;
  public contract_start_date!: Date;
  public contract_end_date!: Date;
  public transaction_id!: string;
  public comments?: string; // Novo campo opcional
  public status!: 'paid' | 'pending' | 'late'; // Adicionado 'late'
  public created_at!: Date;
  public updated_at!: Date;
  
  // Adicione qualquer método ou relacionamento adicional aqui, se necessário
}

UserPricing.init(
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    contract_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    contract_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT, // Novo campo opcional
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('paid', 'pending', 'late'), // Adicionado 'late'
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_pricing',
    timestamps: true, // Automaticamente gerencia `created_at` e `updated_at`
    underscored: true, // Usado para mapear nomes de coluna snake_case para camelCase
  }
);

export default UserPricing;
