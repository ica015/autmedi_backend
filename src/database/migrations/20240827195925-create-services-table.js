'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('services', {
      service_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'clients', // Nome da tabela relacionada
          key: 'client_id',
        },
        allowNull: false,
      },
      professional_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'professionals', // Nome da tabela relacionada
          key: 'professional_id',
        },
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'health_plans', // Nome da tabela relacionada
          key: 'plan_id',
        },
        allowNull: false,
      },
      service_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      tuss_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      tuss_description: {
        type: Sequelize.STRING(255), // Ajustado para a descrição
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('services');
  },
};
