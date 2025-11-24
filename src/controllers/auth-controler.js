import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { config } from '../../boot/index.js'
import * as authService from '../services/auth.js'
import { generateToken, verifyToken } from '../utils/jwt.js'
import { sendMail } from '../lib/mailer.js'

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await authService.getUserByEmail(email)

    if (!user) {
      return res.status(401).send({
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
        payload: {
          user_id: user.id,
        },
        secretOrPrivateKey: 'LOGIN-KEY-HL8D8A3OA1',
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

    if (user.count_login_fail >= config.auth.loginAttempts - 1) {
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
    return res.status(401).send({
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

export async function sendResetPassword(req, res) {
  const { email } = req.body
  const resUser = await authService.getUserByEmail(email)
  if (!resUser)
    return res.status(404).send({ success: false, message: 'Email is invalid' })

  try {
    const token = generateToken({
      payload: { email },
      secretOrPrivateKey: 'FORGET-KEY-XYTAO5YE6N',
      expiresIn: '60m',
    })
    const html = generateResetPasswordEmail(resUser, token)

    const mailOptions = {
      from: config.mail.from,
      to: email,
      subject: 'Reset Password',
      html,
    }
    await sendMail(mailOptions)

    res.send({ success: true, message: 'Send email successful.' })
  } catch (error) {
    throw error
  }
}

export function generateResetPasswordEmail(user, token) {
  const templatePath = path.join(
    process.cwd(),
    'src/assets/mail-templates',
    'reset_password_template.xml'
  )
  let template = fs.readFileSync(templatePath, 'utf8')

  // Replace variables
  template = template
    .replace(/\$\{FIRST_NAME\}/g, user.first_name)
    .replace(/\$\{LAST_NAME\}/g, user.last_name)
    .replace(/\$\{TOKEN\}/g, token)
    .replace(/\$\{BASE_URL\}/g, config.baseURL)
    .replace(/\$\{FRONTEND_BASE_URL\}/g, config.frontendBaseURL)

  return template
}

export async function verifyResetPassword(req, res) {
  try {
    const { token } = req.body
    const decode = verifyToken({
      token,
      secretOrPrivateKey: 'FORGET-KEY-XYTAO5YE6N',
    })

    res.send({
      success: true,
      message: 'Token found',
      data: {
        email: decode.email,
      },
    })
  } catch (error) {
    res
      .status(404)
      .send({ success: false, message: 'Token is invalid or expire' })
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body
    const decode = verifyToken({
      token,
      secretOrPrivateKey: 'FORGET-KEY-XYTAO5YE6N',
    })
    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = await authService.getUserByEmail(decode.email)
    user.password = encryptedPassword
    await user.save()

    res.send({
      success: true,
      message: 'Password has been changed',
    })
  } catch (error) {
    res
      .status(404)
      .send({ success: false, message: 'Token is invalid or expire' })
  }
}
