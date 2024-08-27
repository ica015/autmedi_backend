'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('health_plans');

    // Adiciona o campo available_plan_id, se não existir
    if (!table.available_plan_id) {
      await queryInterface.addColumn('health_plans', 'available_plan_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'available_health_plans',
          key: 'plan_id',
        },
      });
    }

    // Adiciona o campo plan_name, se não existir
    if (!table.plan_name) {
      await queryInterface.addColumn('health_plans', 'plan_name', {
        type: Sequelize.STRING(255),
        allowNull: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove os campos adicionados, se necessário
    await queryInterface.removeColumn('health_plans', 'available_plan_id');
    await queryInterface.removeColumn('health_plans', 'plan_name');
  },
};
