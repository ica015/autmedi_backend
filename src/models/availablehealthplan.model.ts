import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AvailableHealthPlanAttributes {
  plan_id: number;
  plan_name: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface AvailableHealthPlanCreationAttributes extends Optional<AvailableHealthPlanAttributes, 'plan_id' |'created_at' |'updated_at'> {}

export class AvailableHealthPlan extends Model<AvailableHealthPlanAttributes, AvailableHealthPlanCreationAttributes> 
  implements AvailableHealthPlanAttributes {
  public plan_id!: number;
  public plan_name!: string;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

AvailableHealthPlan.init(
  {
    plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'available_health_plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AvailableHealthPlan;
