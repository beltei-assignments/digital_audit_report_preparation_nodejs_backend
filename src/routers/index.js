import middleware from '../middleware/auth.js'
import initAuthRoutes from './auth.js'
import initAccountRoutes from './account.js'

const prefix = '/rest/api'

export default function initAppRoutes(app) {
  app.use(`${prefix}/auth`, initAuthRoutes(middleware))
  app.use(`${prefix}/accounts`, initAccountRoutes(middleware))
}
