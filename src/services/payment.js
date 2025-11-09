import models from '../models/index.js'
import { AppError } from '../utils/error.js'
import { paginate } from '../utils/paginate.js'
import { CURRENCIES } from '../constants/currency.js'

const { Payment, Account } = models

export async function getAllPayments({ fk_user_id, page, limit }) {
  return Payment.findAndCountAll({
    include: [
      {
        model: Account,
        attributes: ['id', 'label'],
        as: 'account',
      },
    ],
    where: {
      fk_user_id,
    },
    ...(limit && {
      ...paginate({ page, limit }),
    }),
    order: [['created_at', 'DESC']],
  })
}

export async function getPaymentById({ id, fk_user_id }) {
  const payment = await Payment.findOne({ where: { id, fk_user_id } })
  if (!payment) {
    throw new AppError({ message: 'No payment found', status: 404 })
  }
  return payment
}

export async function createPayment({ payload, transaction }) {
  const amount =
    payload.currency == CURRENCIES.RIEL ? payload.amount / 4000 : payload.amount
  const account = await Account.findByPk(payload.fk_account_id)
  if (!account) {
    throw new AppError({ message: 'No account found', status: 404 })
  }
  await account.decrement('balance', { by: amount })

  return Payment.create(payload, { transaction })
}
