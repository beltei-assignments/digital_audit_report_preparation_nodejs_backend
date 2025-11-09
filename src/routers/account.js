import { Router } from 'express'
import ensureFields from '../middleware/ensure-fields.js'
// import ensurePermissions from '../middleware/ensure-roles.js'
import * as accountController from '../controllers/account-controller.js'

export default function initRoutes(middleware) {
  const router = Router()
  router.get('/', middleware, accountController.getAll)
  router.post('/', middleware, accountController.create)
  router.put('/:id', middleware, accountController.update)
  return router
}
