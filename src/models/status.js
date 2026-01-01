import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class Status extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name_kh: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  disable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}

Status.init(schema, {
  freezeTableName: true,
  modelName: 'statuses',
  sequelize,
  timestamps: false,
})

export default Status
