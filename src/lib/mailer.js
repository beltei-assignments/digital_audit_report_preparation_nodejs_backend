import nodemailer from 'nodemailer'
import { config } from '../../boot/index.js'

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: {
    user: config.mail.auth.user,
    pass: config.mail.auth.pass,
  },
})

export async function sendMail(options) {
  if (!config.mail.enable) return

  if (config.env == 'qua') {
    options.to = config.mail.redirect
  }

  await transporter.sendMail(options)
}
