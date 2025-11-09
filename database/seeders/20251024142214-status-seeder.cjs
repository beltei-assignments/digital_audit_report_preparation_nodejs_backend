'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('statuses', [
      {
        name: 'Preparing',
        name_kh: 'កំពុងរៀបចំ',
      },
      {
        name: 'Waiting for Review',
        name_kh: 'រងចាំការពិនិត្យ',
      },
      {
        name: 'Rejected',
        name_kh: 'បានបដិសេធ',
      },
      {
        name: 'Finished',
        name_kh: 'រួចរាល់',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('statuses', null, {})
  },
}
