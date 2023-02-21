import express from 'express'
import * as CalendarApiController from '../controllers/calendar.api.controller.js'
import { hasToken } from '../../middlewares/auth.middleware.js'

const route = express.Router()

route.route('/api/calendar')
    .all([hasToken])
    .get(CalendarApiController.findAllEvents)
    .post(CalendarApiController.createEvent)
    

route.route('/api/calendar/:idEvent')
    .all([hasToken])
    .get(CalendarApiController.findEventById)
    .patch(CalendarApiController.updateEventById)
    .delete(CalendarApiController.deleteEventById)
    .put(CalendarApiController.replaceEventById)

export default route