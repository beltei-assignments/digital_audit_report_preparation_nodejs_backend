import { fn, col } from 'sequelize'
import bcrypt from 'bcryptjs'
import * as authService from '../services/auth.js'
import { generateToken } from '../utils/jwt.js'
import models from '../models/index.js'
const { Permission } = models

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await authService.getUserByEmail(email)

    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'Your email or password is invalid',
      })
    }

    if (user.login_failed) {
      const currentDate = new Date()
      const continueDate = new Date(user.login_continue)
      const minutes = continueDate.getMinutes() - currentDate.getMinutes()
      if (minutes > 0) {
        return res.status(403).send({
          success: false,
          message: `Your account have been blocked ${minutes} min(s), please try again later`,
        })
      }

      await user.update({
        count_login_fail: 0,
        login_failed: false,
        login_continue: null,
      })
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.count_login_fail) {
        await user.update({
          count_login_fail: 0,
          count_login_fail_time: 0,
          login_failed: false,
          login_continue: null,
        })
      }

      const token = generateToken({
        user_id: user.id,
      })
      const data = Object.fromEntries(
        Object.entries(user.dataValues).filter(([key, _]) => key !== 'password')
      )

      const roles = await user.getRoles()
      const permissions = (
        await Promise.all(
          roles.map((role) => role.getPermissions({ raws: true }))
        )
      )
        .flat()
        .map(({ id, name, code, role_has_permissions }) => ({
          id,
          name,
          code,
          ...role_has_permissions.dataValues,
        }))

      return res.json({
        success: true,
        user: data,
        roles,
        permissions,
        token,
        message: 'Login is successful.',
      })
    }

    await user.increment('count_login_fail', { by: 1 })
    if (user.count_login_fail >= 3) {
      const dateToContinue = new Date()
      const count =
        user.count_login_fail_time == 0 ? 1 : user.count_login_fail_time + 1
      dateToContinue.setMinutes(dateToContinue.getMinutes() + 5 * count)

      await user.update({
        count_login_fail: 0,
        login_failed: true,
        login_continue: dateToContinue,
      })
      await user.increment('count_login_fail_time', { by: 1 })
    }
    return res.status(403).send({
      success: false,
      message: 'Your email or password is invalid',
    })
  } catch (error) {
    next(error)
  }
}

export async function whoAmI(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.user_id)
    const data = Object.fromEntries(
      Object.entries(user.dataValues).filter(([key, _]) => key !== 'password')
    )

    const roles = await user.getRoles()
    const permissions = (
      await Promise.all(
        roles.map((role) => role.getPermissions({ raws: true }))
      )
    )
      .flat()
      .map(({ id, name, code, role_has_permissions }) => ({
        id,
        name,
        code,
        ...role_has_permissions.dataValues,
      }))

    res.json({ user: data, roles, permissions })
  } catch (error) {
    next(error)
  }
}
