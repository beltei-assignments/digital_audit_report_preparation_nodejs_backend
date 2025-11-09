export default function defineAppDbAssociations(models) {
  const {
    User,
    Role,
    Permission,
    RoleHasPermission,
    UserHasRole,
    Account,
    Payment,
    Status,
    ReportType,
    Regulator,
    Report,
    ReportShared,
  } = models

  // Report
  User.hasMany(Report, {
    foreignKey: 'fk_auditor_id',
    as: 'reports',
    onDelete: 'No Action',
  })
  Report.belongsTo(User, {
    foreignKey: 'fk_auditor_id',
    as: 'user',
    onDelete: 'No Action',
  })

  // Role
  User.belongsToMany(Role, {
    through: UserHasRole, // or through: UserHasRole if it's a model
    foreignKey: 'fk_user_id', // foreign key in UserHasRole pointing to User
    otherKey: 'fk_role_id', // foreign key in UserHasRole pointing to Role
    as: 'roles', // alias for include
  })

  Role.belongsToMany(User, {
    through: UserHasRole,
    foreignKey: 'fk_role_id',
    otherKey: 'fk_user_id',
    as: 'users',
    onDelete: 'NO ACTION',
  })

  // Permission
  Role.belongsToMany(Permission, {
    through: RoleHasPermission,
    foreignKey: 'fk_role_id',
    otherKey: 'fk_permission_id',
    as: 'permissions',
  })

  Permission.belongsToMany(Role, {
    through: RoleHasPermission,
    foreignKey: 'fk_permission_id',
    otherKey: 'fk_role_id',
    as: 'users',
    onDelete: 'NO ACTION',
  })
}
