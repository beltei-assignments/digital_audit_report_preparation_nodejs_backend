import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class Regulator extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  name_en: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  name_kh: {
    type: DataTypes.STRING(512),
    allowNull: true,
  },
  disable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}

Regulator.init(schema, {
  freezeTableName: true,
  modelName: 'regulators',
  sequelize,
  timestamps: false,
})

export default Regulator
