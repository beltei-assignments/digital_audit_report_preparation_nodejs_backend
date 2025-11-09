'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcryptjs')
    const models = await import('../../src/models/index.js')
    const { UserHasRole } = models.default

    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Administrator',
        last_name: 'User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        phone_number: '0123456789',
      },
      {
        first_name: 'Manager',
        last_name: 'User',
        email: 'manager@example.com',
        password: await bcrypt.hash('manager123', 10),
        phone_number: '0123456789',
      },
      {
        first_name: 'Auditor',
        last_name: 'User',
        email: 'auditor@example.com',
        password: await bcrypt.hash('auditor123', 10),
        phone_number: '0123456789',
      },
    ])

    // Assign user roles
    await UserHasRole.bulkCreate([
      {
        fk_user_id: 1, // Administrator User
        fk_role_id: 1, // ADMINISTRATOR
      },
      {
        fk_user_id: 2, // Manager User
        fk_role_id: 2, // MANAGER
      },
      {
        fk_user_id: 3, // Auditor User
        fk_role_id: 3, // AUDITOR
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
    await queryInterface.bulkDelete('user_has_roles', null, {})
  },
}
