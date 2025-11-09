'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const models = await import('../../src/models/index.js')
    const { Role, Permission, RoleHasPermission } = models.default

    const permissions = [
      {
        name: 'Dashboard',
        code: 'DASHBOARD',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
          {
            code: 'MANAGER',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
          {
            code: 'AUDITOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
        ],
      },
      {
        name: 'Roles',
        code: 'ROLES',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
        ],
      },
      {
        name: 'Permissions',
        code: 'PERMISSIONS',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
        ],
      },
      {
        name: 'Users',
        code: 'USERS',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
        ],
      },
      {
        name: 'Regulators',
        code: 'REGULATORS',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
          {
            code: 'MANAGER',
            allows: ['READ'],
          },
          {
            code: 'AUDITOR',
            allows: ['READ'],
          },
        ],
      },
      {
        name: 'Statuses',
        code: 'STATUSES',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
          {
            code: 'MANAGER',
            allows: ['READ'],
          },
          {
            code: 'AUDITOR',
            allows: ['READ'],
          },
        ],
      },
      {
        name: 'Reports',
        code: 'REPORTS',
        roles: [
          {
            code: 'ADMINISTRATOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
          {
            code: 'MANAGER',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
          {
            code: 'AUDITOR',
            allows: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
          },
        ],
      },
    ]

    for (const permissionData of permissions) {
      // Create or find the permission
      const [permission] = await Permission.findOrCreate({
        where: { code: permissionData.code },
        defaults: { name: permissionData.name },
      })

      for (const roleData of permissionData.roles) {
        const role = await Role.findOne({ where: { code: roleData.code } })
        if (role) {
          const allows = {
            create: roleData.allows.includes('CREATE'),
            read: roleData.allows.includes('READ'),
            update: roleData.allows.includes('UPDATE'),
            delete: roleData.allows.includes('DELETE'),
          }

          // Associate role with permissions
          await RoleHasPermission.findOrCreate({
            where: {
              fk_role_id: role.id,
              fk_permission_id: permission.id,
            },
            defaults: allows,
          })
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {})
    await queryInterface.bulkDelete('role_has_permissions', null, {})
  },
}
