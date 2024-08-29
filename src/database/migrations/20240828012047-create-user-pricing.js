'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_pricing', {
      payment_id: {
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
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      contract_start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      contract_end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('paid', 'pending', 'late'),
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
    await queryInterface.dropTable('user_pricing');
  }
};
