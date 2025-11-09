import { config } from '../boot/index.js'

const { name, host, port, username, password, dialect, timezone, option } =
  config.database

export default {
  username,
  password,
  database: name,
  host,
  port,
  dialect,
  timezone,
  ...option,
}
