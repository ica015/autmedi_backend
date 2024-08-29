// material.model.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import {Service} from './';

// Interface para os atributos do modelo
interface MaterialAttributes {
  material_id: number;
  service_id: number;
  name: string;
  measure: string;
  quantity: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para os atributos ao criar uma nova instância
interface MaterialCreationAttributes
  extends Optional<MaterialAttributes, 'material_id' | 'created_at' | 'updated_at'> { }

export class Material extends Model<MaterialAttributes, MaterialCreationAttributes>
  implements MaterialAttributes {
  public material_id!: number;
  public service_id!: number;
  public name!: string;
  public measure!: string;
  public quantity!: number;
  public price!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Definição das associações
  public static associate(models: any) {
    
  }
}

Material.init(
  {
    material_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'services',
        key: 'service_id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'materials',
    timestamps: false,
  }
);

export default Material;
