import nodemailer from 'nodemailer'
import { config } from '../../boot/index.js'
import { sendToMailSerive } from './mail-service.js'

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
  if (!config.mail.enable && !config.mailService.enable) return

  // Using email service instead
  if (config.mailService.enable) {
    sendToMailSerive(options)
    return
  }

  if (config.env == 'qua') {
    options.to = config.mail.redirect
  }

  // Using own email smtp
  await transporter.sendMail(options)
}
