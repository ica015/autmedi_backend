// Migration para remover a restrição de unicidade no campo register_number
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Professionals', 'unique_register_number');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Professionals', {
      fields: ['register_number'],
      type: 'unique',
      name: 'unique_register_number',
    });
  },
};