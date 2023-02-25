import express from "express"
import cors from 'cors'
import CalendarRoutes from './routers/calendar.api.routes.js'
import UsersRoutes from './routers/users.api.routes.js'
import DocumentsRoutes from './routers/documents.api.routes.js'
import cookieParser from "cookie-parser";

process.env.TZ = 'America/Argentina/Buenos_Aires'

const app = express()
app.use(cookieParser())
app.use(cors({origin: 'https://crewdule.vercel.app', credentials: true}))
app.use(express.json())

app.use('/', CalendarRoutes)
app.use('/', UsersRoutes)
app.use('/', DocumentsRoutes)

export default app