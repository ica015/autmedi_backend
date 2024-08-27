'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('health_plans');

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

    // Adicione qualquer outro ajuste ou modificação necessária aqui
  },

  down: async (queryInterface, Sequelize) => {
    // Remova a coluna se necessário
    await queryInterface.removeColumn('health_plans', 'available_plan_id');
  },
};
