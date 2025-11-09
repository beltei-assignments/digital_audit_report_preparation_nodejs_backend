import { Model, DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../../boot/index.js'

class Report extends Model {}

export const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER(11),
  },
  fk_regulator_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'regulators',
      key: 'id',
    },
  },
  fk_status_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'statuses',
      key: 'id',
    },
  },
  fk_report_type_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'report_types',
      key: 'id',
    },
  },
  fk_auditor_id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  progress: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM,
    values: ['critical', 'high', 'medium', 'low'],
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
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

Report.init(schema, {
  freezeTableName: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  modelName: 'reports',
  sequelize,
  timestamps: false,
  defaultScope: {
    where: {
      disable: false,
    },
  },
})

export default Report
