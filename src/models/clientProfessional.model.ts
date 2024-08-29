import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import {Client} from './';
import {Professional} from './';

// Interface para os atributos do modelo
interface ClientProfessionalAttributes {
  client_professional_id:number
  client_id: number;
  professional_id: number;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para os atributos ao criar uma nova instância
interface ClientProfessionalCreationAttributes
  extends Optional<ClientProfessionalAttributes,'client_professional_id' | 'created_at' | 'updated_at'> { }

export class ClientProfessional extends Model<ClientProfessionalAttributes, ClientProfessionalCreationAttributes>
  implements ClientProfessionalAttributes {
  public client_professional_id!: number;
  public client_id!: number;
  public professional_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;


  // Definição das associações
  public static associate(models: any) {
    
  }
}

ClientProfessional.init(
  {
    client_professional_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Client,
        key: 'client_id',
      },
    },
    professional_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Professional,
        key: 'professional_id',
      },
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
    tableName: 'client_professionals',
    timestamps: false,
  }
);

export default ClientProfessional;
