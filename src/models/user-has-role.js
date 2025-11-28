import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class UserHasRole extends Model {}

export const schema = {
  fk_user_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
      onDelete: 'NO ACTION',
    },
  },
  fk_role_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id',
      onDelete: 'NO ACTION',
    },
  },
}

UserHasRole.init(schema, {
  freezeTableName: true,
  modelName: 'user_has_roles',
  sequelize,
  timestamps: false
})

export default UserHasRole
