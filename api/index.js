import express from "express"
import cors from 'cors'
import CalendarRoutes from './routers/calendar.api.routes.js'
import UsersRoutes from './routers/users.api.routes.js'
import DocumentsRoutes from './routers/documents.api.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', CalendarRoutes)
app.use('/', UsersRoutes)
app.use('/', DocumentsRoutes)

export default app