import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import  Professional  from './professional.model'; // Importação do modelo Professional, se necessário
import  ClientProfessional  from './clientProfessional.model'; // Importação do modelo ClientProfessional, se necessário

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
  public static associate() {
    // Defina as associações com outros modelos aqui, se necessário
    this.belongsToMany(Professional, {
      through: ClientProfessional,
      foreignKey: 'client_id',
      as: 'professionals', // Alias para facilitar a busca
    });
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


// import { Model, DataTypes } from 'sequelize';
// import sequelize from '../config/database';
// import Professional from './professional.model';
// import ClientProfessional from './clientProfessional.model';

// class Client extends Model {
//   public client_id!: number;
//   public user_id!: number;
//   public company_name!: string;
//   public contact_number!: string;
//   public status!: 'active' | 'inactive';
//   public readonly created_at!: Date;
//   public readonly updated_at!: Date;
// }

// Client.init(
//   {
//     client_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'user_id',
//       },
//     },
//     company_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     contact_number: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'inactive'),
//       allowNull: false,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'clients',
//     timestamps: false,
//   }
// );
// console.log("Model Clietes Carregado")
// // Associações
// Client.belongsToMany(Professional, {
//   through: ClientProfessional,
//   foreignKey: 'client_id',
// });


// export default Client;
