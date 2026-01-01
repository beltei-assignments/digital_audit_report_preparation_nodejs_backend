'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('statuses', [
      {
        name_en: 'Preparing',
        name_kh: 'កំពុងរៀបចំ',
      },
      {
        name_en: 'Waiting for Review',
        name_kh: 'រងចាំការពិនិត្យ',
      },
      {
        name_en: 'Rejected',
        name_kh: 'បានបដិសេដ',
      },
      {
        name_en: 'Approved',
        name_kh: 'យល់ព្រម​អនុម័ត',
      },
      {
        name_en: 'Finished',
        name_kh: 'រួចរាល់',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('statuses', null, {})
  },
}
