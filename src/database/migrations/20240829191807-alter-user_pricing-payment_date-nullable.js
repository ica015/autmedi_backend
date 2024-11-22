module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_pricing', 'payment_date', {
      type: Sequelize.DATE,
      allowNull: true, // Permitir valores nulos
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user_pricing', 'payment_date', {
      type: Sequelize.DATE,
      allowNull: false, // Reverter para não permitir valores nulos
    });
  }
};
