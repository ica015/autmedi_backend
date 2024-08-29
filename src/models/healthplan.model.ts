import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  Optional,
} from 'sequelize';
import sequelize from '../config/database';

// Definindo as interfaces para os atributos do modelo
export interface HealthPlanAttributes {
  plan_id: number;
  client_id: number;
  available_plan_id: number;
  plan_name: string;
  plan_code: string;
  created_at: Date;
  updated_at: Date;
}

// Definindo as interfaces para os atributos que serão passados na criação
export interface HealthPlanCreationAttributes
  extends Optional<HealthPlanAttributes, 'plan_id' | 'created_at' | 'updated_at'>{}

export class HealthPlan
  extends Model<
    InferAttributes<HealthPlan>,
    HealthPlanCreationAttributes
  >
  implements HealthPlanAttributes
{
  public plan_id!: number;
  public client_id!: number;
  public available_plan_id!: number;
  public plan_name!: string;
  public plan_code!: string;
  public readonly created_at!: CreationOptional<Date>;
  public readonly updated_at!: CreationOptional<Date>;
}

HealthPlan.init(
  {
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'client_id',
      },
    },
    available_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'available_health_plans',
        key: 'plan_id',
      },
    },
    plan_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    plan_code: {
      type: DataTypes.STRING(50),
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
    tableName: 'health_plans',
    timestamps: false,
  }
);

export default HealthPlan;
