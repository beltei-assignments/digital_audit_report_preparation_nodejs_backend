'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        code: 'ADMINISTRATOR',
        name_en: 'Administrator',
        name_kh: 'អេដមីន',
      },
      {
        code: 'MANAGER',
        name_en: 'Manager',
        name_kh: 'ប្រធាន​/អ្នកគ្រប់គ្រង',
      },
      {
        code: 'AUDITOR',
        name_en: 'Auditor',
        name_kh: 'សវនករ',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {})
  },
}
