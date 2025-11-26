import { Router } from 'express'
import ensureFields from '../middleware/ensure-fields.js'
// import ensurePermissions from '../middleware/ensure-roles.js'
import * as reportController from '../controllers/report-controller.js'

export default function initRoutes(middleware) {
  const router = Router()
  router.get('/', middleware, reportController.getAll)
  router.post('/', middleware, reportController.create)
  router.put('/:id', middleware, reportController.update)

  return router
}
