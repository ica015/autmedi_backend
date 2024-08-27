import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class HealthPlan extends Model {
  public plan_id!: number;
  public client_id!: number;
  public available_plan_id!: number;
  public plan_name!: string; // Adicionamos plan_name para evitar inconsistência
  public plan_code!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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
    plan_name: { // Adicionado para manter a consistência com available_health_plans
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    plan_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
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
