import { sequelize } from '../../boot/index.js'
import * as reportService from '../services/report.js'

export async function getAll(req, res, next) {
  try {
    const data = await reportService.getAllReports({
      fk_user_id: req.user.user_id,
      ...req.query,
    })
    res.json(data)
  } catch (error) {
    next(error)
  }
}

export async function create(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const report = await reportService.createReport({
      payload: {
        fk_user_id: req.user.user_id,
        ...req.body,
      },
      transaction,
    })
    transaction.commit()
    res.json({ data: account })
  } catch (error) {
    transaction.rollback()
    next(error)
  }
}

export async function update(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const report = await reportService.updateReport({
      id: req.params.id,
      fk_user_id: req.user.user_id,
      payload: req.body,
      transaction,
    })
    transaction.commit()
    res.json({ data: report })
  } catch (error) {
    transaction.rollback()
    next(error)
  }
}
