'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('guides', {
      guide_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'client_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      professional_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'professionals',
          key: 'professional_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'health_plans',
          key: 'plan_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'service_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      guide_type: {
        type: Sequelize.ENUM('consultation', 'procedure'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('guides');
  },
};