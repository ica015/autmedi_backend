import { AvailableHealthPlan} from './availablehealthplan.model'
import  User  from './user.model'
import {Client} from './client.model'
import {Professional} from './professional.model'
import  {HealthPlan}  from './healthplan.model';
import  {Service}  from './service.model';
import {ClientProfessional} from './clientProfessional.model'
import {Guide} from './guide.model';
import {Material} from './material.model';

//Criando as associações
User.hasMany(Client, {foreignKey:'user_id'})
Client.belongsTo(User, {foreignKey: 'user_id'})
Client.hasMany(ClientProfessional, {foreignKey:'client_id', as:'clients'})
Professional.hasMany(ClientProfessional, { foreignKey:'professional_id'})

Client.belongsToMany(Professional, {
  through: 'ClientProfessional', // Nome da tabela intermediária
  foreignKey: 'client_id',
  otherKey: 'professional_id',
  // as: 'professionals', // Nome da associação
});
// models/Professional.ts
Professional.belongsToMany(Client, {
  through: 'ClientProfessional', // Nome da tabela intermediária
  foreignKey: 'professional_id',
  otherKey: 'client_id',
  // as: 'clients', // Nome da associação
});
Client.hasMany(ClientProfessional, {foreignKey: 'client_id',
  // as: 'clientProfessionals',
});
ClientProfessional.belongsTo(Client, {foreignKey: 'client_id',
  // as: 'client',
});
ClientProfessional.belongsTo(Professional, {foreignKey: 'professional_id',
  // as: 'professional',
});

Client.hasMany(Service, { foreignKey: 'client_id', as: 'services' });
Guide.belongsTo(Client, {foreignKey: 'client_id', as: 'Client' });
Guide.belongsTo(Professional, {foreignKey: 'professional_id', as: 'Professional' });
Guide.belongsTo(HealthPlan, {foreignKey: 'plan_id',as: 'HealthPlan' });
Guide.belongsTo(Service, {foreignKey: 'service_id'  });
Client.hasMany(Guide, { foreignKey: 'client_id' });
Professional.hasMany(Guide, { foreignKey: 'professional_id' });
HealthPlan.hasMany(Guide, { foreignKey: 'plan_id' });
Service.hasMany(Guide, { foreignKey: 'service_id' });

Material.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
Service.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
Service.belongsTo(Professional, { foreignKey: 'professional_id', as: 'professional' });
Service.belongsTo(HealthPlan, { foreignKey: 'plan_id', as: 'healthPlan' });




export {
  AvailableHealthPlan,
  User,
  Client,
  Professional,
  HealthPlan,
  Service,
  ClientProfessional,
  Guide,
  Material

}

// import fs from 'fs';
// import path from 'path';
// import { Sequelize, DataTypes } from 'sequelize';
// import { Dialect } from 'sequelize/types';
// // @ts-ignore
// import config from '../../sequelize-cli.config';

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const db: any = {};

// let sequelize: Sequelize;
// const dbConfig = config[env as keyof typeof config];

// if (dbConfig.use_env_variable) {
//   sequelize = new Sequelize(process.env[dbConfig.use_env_variable] as string, dbConfig);
// } else {
//   sequelize = new Sequelize(
//     dbConfig.database as string,
//     dbConfig.username as string,
//     dbConfig.password as string,
//     dbConfig as {
//       host: string;
//       dialect: Dialect;
//       port: number;
//     }
//   );
// }

// // Carrega todos os modelos no diretório atual (models)
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       (file.slice(-3) === '.js' || file.slice(-3) === '.ts') &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach((file) => {
//     console.log(`Dir: ${__dirname}, arquivo ${file}.`);

//     // Usa import para carregar os módulos
//     const model = require(path.join(__dirname, file)).default(sequelize, DataTypes);

//     db[model.name] = model;
//   });

// // Configura as associações entre os modelos
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;


// -------------- Aqui começa TS 01 ----------------------
// import fs from 'fs';
// import path from 'path';
// import { Sequelize, DataTypes } from 'sequelize';
// import { Dialect } from 'sequelize/types';

// // import { SequelizeConfig } from '../../sequelize-cli.config';

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// // const config = (require('../../sequelize-cli.config') as SequelizeConfig)[env];
// const config = require('../../sequelize-cli.config')[env]
// const db: { [key: string]: any } = {};

// let sequelize: Sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
// } else {
//   sequelize = new Sequelize(
//     config.database as string,
//     config.username as string,
//     config.password as string,
//     config
//   );
// }

// // Load all models in the current directory (models)
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 && 
//       file !== basename && 
//       (file.slice(-3) === '.js' || file.slice(-3) === '.ts') && 
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     console.log(`Dir: ${__dirname}, arquivo ${file}.`);
//     const model = require(path.join(__dirname, file)).default(sequelize, DataTypes);
//     db[model.name] = model;
//   });

// // Set up associations between models
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// export { sequelize, Sequelize };
// export default db;



// ------------ Aqui começa JS -----------------
// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require('../../sequelize-cli.config')[env]
// const db = {};


// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// // Carrega todos os modelos no diretório atual (models)
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 && 
//       file !== basename && 
//       (file.slice(-3) === '.js' || file.slice(-3) === '.ts') && 
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     console.log(`Dir: ${__dirname}, arquivo ${file}.`);
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// // Configura as associações entre os modelos
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
