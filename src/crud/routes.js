import { Router } from 'express'
import initServices from './services.js'
import ensureFields from '../middleware/ensure-fields.js'
import { ensurePermissions } from '../middleware/ensure-roles.js'

export default function initRoutes(tableName, config) {
  const router = new Router()
  const services = initServices(tableName, config)
  // router.get('/schema', services.getSchema)
  router.get('/', ensurePermissions({ read: 'CRUD' }), services.getAll)

  router.get(
    '/:id',
    ensureFields(
      {
        id: {
          notEmpty: true,
          isInt: true,
        },
      },
      { limitTo: ['params'] }
    ),
    ensurePermissions({ read: 'CRUD' }),
    services.findByPk
  )

  router.post(
    '/',
    ensureFields(
      {
        ...config.RULES,
      },
      { limitTo: ['body'] }
    ),
    ensurePermissions({ create: 'CRUD' }),
    services.create
  )

  router.put(
    '/:id',
    ensureFields(
      {
        id: {
          notEmpty: true,
          isInt: true,
        },
        ...config.RULES,
      },
      { limitTo: ['params', 'body'] }
    ),
    ensurePermissions({ update: 'CRUD' }),
    services.update
  )

  router.delete(
    '/:id',
    ensureFields(
      {
        id: {
          notEmpty: true,
          isInt: true,
        },
      },
      { limitTo: ['params'] }
    ),
    ensurePermissions({ delete: 'CRUD' }),
    services.destroy
  )

  return router
}
