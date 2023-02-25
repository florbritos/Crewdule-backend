import express from "express";
import CalendarRoutes from './api/routers/calendar.api.routes.js'
import UsersRoutes from './api/routers/users.api.routes.js'
import DocumentsRoutes from './api/routers/documents.api.routes.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(CalendarRoutes)
app.use(UsersRoutes)
app.use(DocumentsRoutes)

app.listen(2022, function(){
    console.log('Service is running on port 2022')
    console.log('http://localhost:2022')
})