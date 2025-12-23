import middleware from '../middleware/auth.js'
import initAuthRoutes from './auth.js'
import initReportRoutes from './report.js'
import initExportRoutes from './export.js'

const prefix = '/rest/api'

export default function initAppRoutes(app) {
  app.use(`${prefix}/auth`, initAuthRoutes(middleware))
  app.use(`${prefix}/reports`, initReportRoutes(middleware))
  app.use(`${prefix}/export`, initExportRoutes(middleware))
}
