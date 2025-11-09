import models from '../models/index.js'
const { User } = models

export async function getUserByEmail(email) {
  return User.findOne({ where: { email } })
}

export async function getUserById(id) {
  return User.findOne({
    where: { id },
  })
}

export function createUser(payload) {
  return User.create(payload)
}
