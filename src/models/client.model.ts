import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definição dos tipos para os atributos de Client
interface ClientAttributes {
  client_id: number;
  user_id: number;
  company_name: string;
  contact_number: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// Para criação, o ID é opcional pois será gerado automaticamente
interface ClientCreationAttributes extends Optional<ClientAttributes, 'client_id' | 'created_at' | 'updated_at'> {}

// Definição da classe do modelo Client
export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public client_id!: number;
  public user_id!: number;
  public company_name!: string;
  public contact_number!: string;
  public status!: 'active' | 'inactive';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Definição das associações
  public static associate(models:any) {
    // Defina as associações com outros modelos aqui, se necessário
    
  }
}

// Inicialização do modelo Client
Client.init(
  {
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
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
    tableName: 'clients',
    timestamps: false, // Se você não quer utilizar os timestamps automáticos do Sequelize
  }
);

// Exportação do modelo
export default Client;
