module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_pricing', 'comments', {
      type: Sequelize.TEXT,
      allowNull: true, // Campo opcional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_pricing', 'comments');
  }
};