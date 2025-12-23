import { Router } from 'express'
import * as exportController from '../controllers/export-controller.js'

export default function initRoutes(middleware) {
  const router = Router()
  router.post('/pdf', middleware, exportController.exportPDF)

  return router
}
