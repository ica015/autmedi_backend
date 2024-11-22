module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pricing_rules', {
      rule_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nome da tabela de usuários
          key: 'user_id'
        },
        onDelete: 'CASCADE',
      },
      price_per_professional: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pricing_rules');
  }
};
