'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "type", {
      type: Sequelize.STRING,
      defaultValue: "no-admin"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "type");
  }
};