import { boot } from '../boot/index.js'
import app from './app.js'
import initAppRoutes from './routers/index.js'
// import initCrud from './crud/index.js'
import { errorHandler } from './middleware/error.js'

app.use(errorHandler)

boot(app)
initAppRoutes(app)
// initCrud(app)
