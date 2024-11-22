'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('users', 'cfp_cnpj', {
      type: DataTypes.STRING(20),
      allowNull: true, // Define como optional, ajuste conforme necessário
    });

    await queryInterface.addColumn('users', 'address', {
      type: DataTypes.STRING(150),
      allowNull: true, // Define como optional, ajuste conforme necessário
    });

    await queryInterface.addColumn('users', 'number', {
      type: DataTypes.INTEGER,
      allowNull: true, // Define como optional, ajuste conforme necessário
    });

    await queryInterface.addColumn('users', 'neighborhood', {
      type: DataTypes.STRING(100),
      allowNull: true, // Define como optional, ajuste conforme necessário
    });

    await queryInterface.addColumn('users', 'city', {
      type: DataTypes.STRING(150),
      allowNull: true, // Define como optional, ajuste conforme necessário
    });

    await queryInterface.addColumn('users', 'state', {
      type: DataTypes.STRING(2),
      allowNull: true, // Define como optional, ajuste conforme necessário
    });
    // await queryInterface.changeColumn('users', 'role', {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   field: 'rule' // Renomeia o campo 'role' para 'rule'
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverte as alterações realizadas no método up
    await queryInterface.removeColumn('users', 'cfp_cnpj');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'number');
    await queryInterface.removeColumn('users', 'neighborhood');
    await queryInterface.removeColumn('users', 'city');
    await queryInterface.removeColumn('users', 'state');

    // await queryInterface.changeColumn('users', 'rule', {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   field: 'role' // Reverte o campo 'rule' de volta para 'role'
    // });
  }
};
