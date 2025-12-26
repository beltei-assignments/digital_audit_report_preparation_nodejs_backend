import { config } from '../../boot/index.js'
import axios from 'axios'

export async function sendToMailSerive({ name, from, to, subject, html }) {
  if (!config.mailService.enable) return

  if (config.env == 'qua') {
    to = config.mailService.redirect
  }

  await axios.post(
    `${config.mailService.url}/api/send-email`,
    {
      name,
      from,
      to,
      subject,
      html,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.mailService.apiKey,
      },
      timeout: 5000,
    }
  )
}
