'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const constant = await import('../../src/constants/index.js')
    const { PRIORITY_NAME, REPORT_TYPE_ID, STATUS_ID } = constant

    return queryInterface.bulkInsert('reports', [
      {
        name: 'Draft audit report',
        content: `
        <h1>Welcome to My Website</h1>
        <p>This is a simple paragraph with some <strong>bold text</strong> and some <em>italic text</em>.</p>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
        <p>Feel free to <a href="https://example.com">click here</a> for more information!</p>
        `,
        progress: 10,
        fk_auditor_id: 3,
        fk_report_type_id: REPORT_TYPE_ID.DRAFT,
        fk_regulator_id: 1,
        fk_status_id: STATUS_ID.PREPARING,
        priority: PRIORITY_NAME.HIGH,
        start_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        name: 'Simple audit report',
        content: `
        <h1>Welcome to My Website</h1>
        <p>This is a simple paragraph with some <strong>bold text</strong> and some <em>italic text</em>.</p>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
        <p>Feel free to <a href="https://example.com">click here</a> for more information!</p>
        `,
        progress: 20,
        fk_auditor_id: 3,
        fk_report_type_id: REPORT_TYPE_ID.DRAFT,
        fk_regulator_id: 1,
        fk_status_id: STATUS_ID.PREPARING,
        priority: PRIORITY_NAME.LOW,
        start_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        name: 'My audit report',
        content: `
        <h1>Welcome to My Website</h1>
        <p>This is a simple paragraph with some <strong>bold text</strong> and some <em>italic text</em>.</p>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
        <p>Feel free to <a href="https://example.com">click here</a> for more information!</p>
        `,
        progress: 40,
        fk_auditor_id: 3,
        fk_report_type_id: REPORT_TYPE_ID.DRAFT,
        fk_regulator_id: 1,
        fk_status_id: STATUS_ID.PREPARING,
        priority: PRIORITY_NAME.MEDIUM,
        start_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('reports', null, {})
  },
}
