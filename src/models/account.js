import { Model, DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class Account extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  fk_user_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  label: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  color: {
    type: DataTypes.STRING(32),
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(32),
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  disable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

Account.init(schema, {
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'accounts',
  sequelize,
  timestamps: false,
  defaultScope: {
    where: {
      disable: false,
    },
    order: [['order', 'DESC']],
  },
})

export default Account
