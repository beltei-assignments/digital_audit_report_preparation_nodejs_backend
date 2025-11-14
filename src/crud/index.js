import { readFileSync } from 'node:fs'
import * as path from 'path'
import initRoutes from './routes.js'
import middleware from '../middleware/auth.js'

export default async function initCrud(app) {
  console.log('-------> ⚒️  Initializing CRUD app, please wait... <-------')
  const crudConfig = JSON.parse(
    readFileSync(path.resolve(`${process.cwd()}/config/crud.json`))
  )

  for (const table in crudConfig.TABLES) {
    console.log(`-------> route ==> /rest/api/crud/${table}`)

    app.use(
      `/rest/api/crud/${table}`,
      middleware,
      initRoutes(table, crudConfig.TABLES[table])
    )
  }

  console.log('-------> ✔️  Initialed CRUD app <-------')
}
