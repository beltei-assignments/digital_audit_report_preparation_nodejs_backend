import express from 'express'
import { boot } from '../boot/index.js'
import app from './app.js'
import initAppRoutes from './routers/index.js'
import initCrud from './crud/index.js'
import { errorHandler } from './middleware/error.js'
import path from 'path'
import { fileURLToPath } from 'url'
import i18n from './lib/i18n.js'
import cookieParser from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use(express.static('public'))
app.use(cookieParser())
app.use(i18n.init)

await boot(app)
await initCrud(app)
initAppRoutes(app)

app.use(errorHandler)

app.get('/api/welcome', (req, res) => {
  res.json({
    message: res.__('welcome')
  });
});