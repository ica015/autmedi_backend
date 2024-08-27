'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clients', 'address');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clients', 'address', {
      type: Sequelize.STRING(255)
    });
  }
};