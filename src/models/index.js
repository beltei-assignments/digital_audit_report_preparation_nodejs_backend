import defineAppDbAssociations from './associations.js'
import User from './user.js'
import Role from './role.js'
import Permission from './permission.js'
import RoleHasPermission from './role-has-permission.js'
import UserHasRole from './user-has-role.js'
import Status from './status.js'
import ReportType from './report-type.js'
import Regulator from './regulator.js'
import Report from './report.js'
import ReportShared from './report-shared.js'

export default {
  User,
  Role,
  Permission,
  RoleHasPermission,
  UserHasRole,
  Status,
  ReportType,
  Regulator,
  Report,
  ReportShared,
}

defineAppDbAssociations({
  User,
  Role,
  Permission,
  RoleHasPermission,
  UserHasRole,
  Status,
  ReportType,
  Regulator,
  Report,
  ReportShared,
})
