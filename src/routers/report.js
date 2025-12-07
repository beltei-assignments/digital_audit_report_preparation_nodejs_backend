import { Router } from 'express'
import ensureFields from '../middleware/ensure-fields.js'
// import ensurePermissions from '../middleware/ensure-roles.js'
import * as reportController from '../controllers/report-controller.js'

export default function initRoutes(middleware) {
  const router = Router()
  router.get('/', middleware, reportController.getAll)
  router.get(
    '/count-status',
    middleware,
    reportController.countStatus
  )
  router.get(
    '/generate-notifications',
    middleware,
    reportController.generateNotifications
  )
  router.get('/:id', middleware, reportController.getById)
  router.post('/', middleware, reportController.create)
  router.put('/:id', middleware, reportController.update)
  router.put('/:id/send-request', middleware, reportController.sendRequest)
  router.delete('/:id', middleware, reportController.remove)

  return router
}
