import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class RoleHasPermission extends Model {}

export const schema = {
  fk_role_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  fk_permission_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id',
    },
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  create: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  update: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}

RoleHasPermission.init(schema, {
  freezeTableName: true,
  modelName: 'role_has_permissions',
  sequelize,
  timestamps: false,
})

export default RoleHasPermission
