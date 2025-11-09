import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class ReportType extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  name: {
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

ReportType.init(schema, {
  freezeTableName: true,
  modelName: 'report_types',
  sequelize,
  timestamps: false,
})

export default ReportType
