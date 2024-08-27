'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove o campo `plan_id` da tabela `professionals`
    await queryInterface.removeColumn('professionals', 'plan_id');

    // Cria a tabela `client_professionals` para relacionamento entre `clients` e `professionals`
    await queryInterface.createTable('client_professionals', {
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'professionals',
          key: 'professional_id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverte a criação da tabela `client_professionals`
    await queryInterface.dropTable('client_professionals');

    // Recria o campo `plan_id` na tabela `professionals`
    await queryInterface.addColumn('professionals', 'plan_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'health_plans',
        key: 'plan_id',
      },
      onDelete: 'SET NULL',
    });
  },
};
