'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona o campo client_professional_id
    await queryInterface.addColumn('client_professionals', 'client_professional_id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove o campo client_professional_id
    await queryInterface.removeColumn('client_professionals', 'client_professional_id');
  }
};
