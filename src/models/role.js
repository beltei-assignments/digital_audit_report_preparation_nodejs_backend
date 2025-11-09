import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class Role extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  code: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name_kh: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}

Role.init(schema, {
  freezeTableName: true,
  modelName: 'roles',
  sequelize,
  timestamps: false,
})

export default Role
