import { Router } from 'express'
import initServices from './services.js'
import ensureFields from '../middleware/ensure-fields.js'

export default function initRoutes(tableName, config) {
  const router = new Router()
  const services = initServices(tableName, config)
  // router.get('/schema', services.getSchema)
  router.get('/', services.getAll)

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
    services.destroy
  )

  return router
}
