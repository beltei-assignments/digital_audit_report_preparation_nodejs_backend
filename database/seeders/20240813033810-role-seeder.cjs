'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        code: 'ADMINISTRATOR',
        name: 'Administrator',
        name_kh: 'អេដមីន',
      },
      {
        code: 'MANAGER',
        name: 'Manager',
        name_kh: 'អ្នកគ្រប់គ្រង',
      },
      {
        code: 'AUDITOR',
        name: 'Auditor',
        name_kh: 'អ្នកពិនិត្យ',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {})
  },
}
