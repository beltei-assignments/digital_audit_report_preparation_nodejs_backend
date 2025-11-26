import models from '../models/index.js'
import { AppError } from '../utils/error.js'

const { Report } = models

export async function getAllReports({ fk_user_id }) {
  const data = await Report.findAndCountAll({
    // where: {
    //   fk_user_id,
    // },
  })

  return data
}

export async function getReportById({ id, fk_user_id }) {
  return Report.findOne({ where: { id, fk_user_id } })
}

export async function createReport({ payload, transaction }) {
  return Report.create(payload, { transaction })
}

export async function updateReport({ id, fk_user_id, payload, transaction }) {
  const account = await getReportById({ id, fk_user_id })
  if (!account) {
    throw new AppError({ message: 'No report found', status: 404 })
  }
  account.update(payload)
  return account
}
