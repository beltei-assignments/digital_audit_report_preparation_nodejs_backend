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

export async function getById(req, res, next) {
  try {
    const data = await reportService.getReportById({
      id: req.params.id,
      fk_auditor_id: req.user.user_id,
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
        fk_auditor_id: req.user.user_id,
        ...req.body,
      },
      transaction,
    })
    await transaction.commit()
    res.json(report)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

export async function update(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const report = await reportService.updateReport({
      id: req.params.id,
      fk_auditor_id: req.user.user_id,
      payload: req.body,
      transaction,
    })
    await transaction.commit()
    res.json({ data: report })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

export async function sendRequest(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const report = await reportService.sendRequest({
      id: req.params.id,
      fk_auditor_id: req.user.user_id,
      payload: req.body,
      transaction,
    })
    await transaction.commit()
    res.json({ data: report })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

export async function remove(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const report = await reportService.deleteReport({
      id: req.params.id,
      fk_auditor_id: req.user.user_id,
      transaction,
    })
    await transaction.commit()
    res.json({ data: report })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}
