'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('regulators', [
      {
        name_en: 'Social Security Regulator',
        name_kh: 'និយ័តករសន្តិសុខសង្គម',
      },
      {
        name_en: 'Insurance Regulator of Cambodia',
        name_kh: 'និយ័តករធានារ៉ាប់រងកម្ពុជា',
      },
      {
        name_en: 'Accounting and Auditing Regulator',
        name_kh: 'និយ័តករគណនេយ្យនិងសវនកម្ម',
      },
      {
        name_en: 'Real Estate and Mortgage Business Regulator',
        name_kh: 'និយ័តករអាជីវកម្មអចលនវត្ថុ និងបញ្ចាំ',
      },
    ])
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('regulators', null, {})
  },
}
