'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('professionals', 'client_id');

    await queryInterface.renameColumn('professionals', 'crm', 'register_number');

    await queryInterface.addColumn('professionals', 'register_type', {
      type: Sequelize.STRING,
      allowNull: true, // Defina como 'false' se o campo for obrigatório
    });

    await queryInterface.addColumn('professionals', 'register_state', {
      type: Sequelize.STRING(2),
      allowNull: true, // Defina como 'false' se o campo for obrigatório
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('professionals', 'client_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'clients',
        key: 'client_id',
      },
    });

    await queryInterface.renameColumn('professionals', 'register_number', 'crm');

    await queryInterface.removeColumn('professionals', 'register_type');
    await queryInterface.removeColumn('professionals', 'register_state');
  },
};
