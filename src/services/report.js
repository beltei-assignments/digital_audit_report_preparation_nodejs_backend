import models from '../models/index.js'
import { AppError } from '../utils/error.js'
import { Op } from 'sequelize'

const { Report, Regulator, Status } = models

export async function getAllReports({ fk_user_id, fk_report_type_id, id, name, priority }) {
  const data = await Report.findAndCountAll({
    include: [
      {
        model: Regulator,
        as: 'regulator',
      },
      {
        model: Status,
        as: 'status',
      },
    ],
    where: {
      disable: false,
      ...(fk_user_id && { fk_auditor_id: fk_user_id }),
      ...(fk_report_type_id && { fk_report_type_id }),
      ...(id && { id }),
      ...(priority && { priority }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
    },
    order: [['id', 'DESC']],
  })

  return data
}

export async function getReportById({ id, fk_auditor_id }) {
  const report = await Report.findOne({
    where: { id, fk_auditor_id, disable: false },
  })

  if (!report) {
    throw new AppError({ message: 'No report found', status: 404 })
  }
  return report
}

export async function createReport({ payload, transaction }) {
  return Report.create(payload, { transaction })
}

export async function updateReport({ id, fk_auditor_id, payload, transaction }) {
  const report = await getReportById({ id, fk_auditor_id })
  await report.update(payload, { transaction })
  return report
}

export async function deleteReport({ id, fk_auditor_id, transaction }) {
  const report = await getReportById({ id, fk_auditor_id })
  await report.update({ disable: true }, { transaction })
}
