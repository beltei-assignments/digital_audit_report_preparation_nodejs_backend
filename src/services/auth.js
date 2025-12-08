import models from '../models/index.js'
import { AppError } from '../utils/error.js'
import { Op } from 'sequelize'

const { User } = models

export async function getUserByEmail(email) {
  return User.findOne({ where: { email } })
}

export async function getUserById(id) {
  return User.findOne({
    where: { id },
  })
}

export async function createUser(payload) {
  return User.create(payload)
}

export async function updateUser(id, payload) {
  if (payload.email) {
    const exist = await User.findOne({
      where: {
        email: payload.email,
        id: {
          [Op.not]: id,
        },
      },
    })
    if (exist) {
      throw new AppError({ message: 'Email is already exist', status: 400 })
    }
  }

  const user = await User.findOne({
    where: { id },
  })
  if (!user) {
    throw new AppError({ message: 'No user found', status: 404 })
  }

  return user.update(payload)
}
