import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Client } from './client.model'; // Importação do modelo Client, se necessário
import  ClientProfessional  from './clientProfessional.model'; // Importação do modelo ClientProfessional, se necessário

// Define a interface para os atributos do modelo
interface ProfessionalAttributes {
    professional_id: number;
    name: string;
    register_number: number; // Renomeado de crm para register_number
    register_type?: string; // Novo campo
    register_state?: string; // Novo campo
    specialty_code?: number;
    specialty_description?: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  // Define a interface para criar novos registros
  interface ProfessionalCreationAttributes
    extends Optional<ProfessionalAttributes, 'professional_id' | 'created_at' | 'updated_at'> {}
  
  // Define a classe do modelo
  class Professional extends Model<ProfessionalAttributes, ProfessionalCreationAttributes>
    implements ProfessionalAttributes {
    public professional_id!: number;
    public name!: string;
    public register_number!: number; // Renomeado de crm para register_number
    public register_type?: string; // Novo campo
    public register_state?: string; // Novo campo
    public specialty_code?: number;
    public specialty_description?: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

  // Definição das associações
  public static associate(models: any) {
    // Associações com a tabela Client através da tabela intermediária ClientProfessional
    this.belongsToMany(models.Client, {
      through: models.ClientProfessional,
      foreignKey: 'professional_id',
      as: 'clients', // Alias para facilitar a busca
    });
  }
}

Professional.init(
    {
      professional_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      register_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      register_type: {
        type: DataTypes.STRING,
        allowNull: true, // Defina como 'false' se o campo for obrigatório
      },
      register_state: {
        type: DataTypes.STRING(2),
        allowNull: true, // Defina como 'false' se o campo for obrigatório
      },
      specialty_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      specialty_description: {
        type: DataTypes.STRING(255),
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
    },
    {
      sequelize,
      tableName: 'professionals',
      timestamps: false,
    }
  );
  
  export default Professional;