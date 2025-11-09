// import { readFileSync } from 'node:fs'
// import * as path from 'path'
// import initRoutes from './routes.js'
// import middleware from '../middleware/auth.js'

// export default async function initCrud(app) {
//   console.log('initCrud')
//   const crudConfig = JSON.parse(
//     readFileSync(path.resolve(`${process.cwd()}/config/crud.json`))
//   )
//   for (const table in crudConfig.tables) {
//     console.log(`/${table}`)
//     app.use(`/api/${table}`, middleware, initRoutes(table, crudConfig.tables[table]))
//   }
// }
