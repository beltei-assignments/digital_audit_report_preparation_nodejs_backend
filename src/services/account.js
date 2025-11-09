import models from '../models/index.js'
import { AppError } from '../utils/error.js'

const { Account } = models

export async function getAllAccounts({ fk_user_id }) {
  return Account.findAndCountAll({
    where: {
      fk_user_id,
    },
  })
}

export async function getAccountById({ id, fk_user_id }) {
  return Account.findOne({ where: { id, fk_user_id } })
}

export async function createAccount({ payload, transaction }) {
  return Account.create(payload, { transaction })
}

export async function updateAccount({ id, fk_user_id, payload, transaction }) {
  const account = await getAccountById({ id, fk_user_id })
  if (!account) {
    throw new AppError({ message: 'No account found', status: 404 })
  }
  account.update(payload)
  return account
}
