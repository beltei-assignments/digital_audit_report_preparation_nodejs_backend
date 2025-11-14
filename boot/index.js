import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { Sequelize } from 'sequelize'
import { readJsonFile } from '../src/utils/files.js'

export const config = await readJsonFile('config/config.json')

const { name, host, port, username, password, dialect, timezone, option } =
  config.database

export const sequelize = new Sequelize(name, username, password, {
  host,
  port,
  dialect,
  timezone,
  ...option,
})

export function createMyApp() {
  const app = express()
  app.use(cors({ origin: config.cors.origin }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  return app
}

export async function boot(app) {
  const server = http.createServer(app)
  const io = new Server(server, { cors: config.cors })

  io.on('connection', (socket) => {
    console.log('a client connected')
    socket.on('msg_to_server', (ms) => {
      io.emit('msg_to_client', ms)
    })
  })

  console.log('-------> ⌛  Connecting to database, please wait... <-------')
  await sequelize.sync({ force: option.force })
  console.log('-------> ✔️  Connectedto database <-------')

  server.listen(config.port, () => {
    console.log(
      `-------> 🎉  Server is running on url: http://${config.host}:${config.port} <-------`
    )
  })
}
