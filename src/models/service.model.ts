import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import {Professional} from './';
import {HealthPlan} from './'; // Ajuste o caminho se necessário
import {Client} from './'; // Ajuste o caminho se necessário

// Interface para os atributos do modelo
interface ServiceAttributes {
  service_id: number;
  client_id: number;
  professional_id: number;
  plan_id: number;
  service_name: string;
  tuss_code: string;
  tuss_description?: string;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para os atributos ao criar uma nova instância
export interface ServiceCreationAttributes
  extends Optional<ServiceAttributes, 'service_id' | 'created_at' | 'updated_at'> { }

export class Service extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes {
  public service_id!: number;
  public client_id!: number;
  public professional_id!: number;
  public plan_id!: number;
  public service_name!: string;
  public tuss_code!: string;
  public tuss_description?: string;
  public price!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Definição das associações
  public static associate(models: any) {

  }
}

Service.init(
  {
    service_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'clients', // Nome da tabela relacionada
        key: 'client_id',
      },
      allowNull: false,
    },
    professional_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'professionals', // Nome da tabela relacionada
        key: 'professional_id',
      },
      allowNull: false,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'health_plans', // Nome da tabela relacionada
        key: 'plan_id',
      },
      allowNull: false,
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tuss_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tuss_description: {
      type: DataTypes.STRING(255), // Ajustado para a descrição
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'services',
    timestamps: false,
  }
);

export default Service;
