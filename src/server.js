import { boot } from '../boot/index.js'
import app from './app.js'
import initAppRoutes from './routers/index.js'
import initCrud from './crud/index.js'
import { errorHandler } from './middleware/error.js'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use(express.static('public'))

await boot(app)
await initCrud(app)
initAppRoutes(app)

app.use(errorHandler)
