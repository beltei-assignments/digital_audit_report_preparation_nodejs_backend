import { sequelize } from '../../boot/index.js'
import * as accountService from '../services/account.js'

export async function getAll(req, res, next) {
  try {
    const data = await accountService.getAllAccounts({
      fk_user_id: req.user.user_id,
      ...req.query,
    })
    res.json({ data })
  } catch (error) {
    next(error)
  }
}

export async function create(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const account = await accountService.createAccount({
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
    const account = await accountService.updateAccount({
      id: req.params.id,
      fk_user_id: req.user.user_id,
      payload: req.body,
      transaction,
    })
    transaction.commit()
    res.json({ data: account })
  } catch (error) {
    transaction.rollback()
    // next(error)
    const status = error.status || 500
    const message = error.message || 'Internal Server Error'
    res.status(status).json({ message })
  }
}
