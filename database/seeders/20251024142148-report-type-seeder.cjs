'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('report_types', [
      {
        name: 'Draft Audit Report',
        name_kh: 'សេចក្តីព្រាងរបាយការណ៍សវនកម្ម',
      },
      {
        name: 'Preliminary Audit Report',
        name_kh: 'សេចក្តីព្រាងបឋមរបាយការណ៍សវនកម្ម',
      },
      {
        name: 'Audit Report',
        name_kh: 'របាយការណ៍សវនកម្ម',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('report_types', null, {})
  },
}
