import { Model, DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class UserHasRole extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  fk_report_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'reports',
      key: 'id',
      onDelete: 'NO ACTION',
    },
  },
  fk_user_to_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
      onDelete: 'NO ACTION',
    },
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}

UserHasRole.init(schema, {
  freezeTableName: true,
  modelName: 'user_has_roles',
  sequelize,
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

export default UserHasRole
