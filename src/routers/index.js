import middleware from '../middleware/auth.js'
import initAuthRoutes from './auth.js'
import initReportRoutes from './report.js'

const prefix = '/rest/api'

export default function initAppRoutes(app) {
  app.use(`${prefix}/auth`, initAuthRoutes(middleware))
  app.use(`${prefix}/reports`, initReportRoutes(middleware))
}
