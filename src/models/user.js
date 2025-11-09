import { Model, DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class User extends Model {}

export const userSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  profile_img_base64: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  count_login_fail_time: {
    type: DataTypes.INTEGER(11),
    defaultValue: 0,
    allowNull: false,
  },
  count_login_fail: {
    type: DataTypes.INTEGER(11),
    defaultValue: 0,
    allowNull: false,
  },
  login_failed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  login_continue: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  disable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}

User.init(userSchema, {
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'users',
  sequelize,
  timestamps: false,
  defaultScope: {
    where: {
      disable: false,
    },
  },
})

export default User
