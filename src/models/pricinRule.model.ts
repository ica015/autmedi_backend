import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database'; // Ajuste o caminho conforme a estrutura do seu projeto
import { User } from './'; // Ajuste o caminho conforme a estrutura do seu projeto

// Interface que define os atributos do modelo
interface PricingRuleAttributes {
  rule_id: number;
  user_id: number;
  price_per_professional: number;
  valid_from: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para criação de um novo registro
interface PricingRuleCreationAttributes extends Optional<PricingRuleAttributes, 'rule_id' | 'created_at' | 'updated_at'> {}

// Classe do modelo
export class PricingRule extends Model<PricingRuleAttributes, PricingRuleCreationAttributes> implements PricingRuleAttributes {
  public rule_id!: number;
  public user_id!: number;
  public price_per_professional!: number;
  public valid_from!: Date;
  public created_at?: Date;
  public updated_at?: Date;

  // Associação
  public User?: User;

  // Timestamps automáticos gerenciados pelo Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialização do modelo
PricingRule.init(
  {
    rule_id: {
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
      onDelete: 'CASCADE',
    },
    price_per_professional: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'pricing_rules',
    timestamps: true,
    underscored: true,
  }
);

// Definição da associação


export default PricingRule;
