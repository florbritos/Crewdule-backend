import { ConnectionClosedEvent } from 'mongodb'
import { typeOfEvent } from '../../helpers/data.js'
import { eventValidation } from '../../helpers/eventValidation.js'
import * as CalendarService from '../../services/calendar.service.js'
import * as UserService from '../../services/users.service.js'

function findAllEvents(req, res){

    const filter = req.query

    CalendarService.getAllEvents(filter)
    .then(function (fullCalendar){
        res.status(200).json(fullCalendar)
    })
}

function findEventById(req, res){

    const id = req.params.idEvent

    CalendarService.getEventById(id)
    .then(function(event){
        if(event){
            res.status(200).json(event)
        } else {
            res.status(404).json({message: 'Event does not exists'})
        }
    })
}

function createEvent(req, res){

    if(req.body.user_id){
        UserService.findById(req.body.user_id)
        .then(function(user){
            if(user){
                if(!req.body.title){

                    res.status(400).json({message: 'To start creating an event the title must be set. Options (Flight, Stand-by, Sick Leave, Holidays, Off day, Simulator, Training)'})

                } else if(typeEvents.indexOf(req.body.title) == -1){

                    res.status(400).json({message: 'The title must be one of the following options: Flight, Stand-by, Sick Leave, Holidays, Off day, Simulator or Training'})

                } else {

                    const event = gettingEventReady(req.body, req.body.title)

                    let validationErrors = eventValidation(event)

                    if(Object.entries(validationErrors).length === 0){
                        let eventToBeCreated = {...event, user_id: user._id}
                        CalendarService.saveNewEvent(eventToBeCreated)
                        .then(function(newEvent){
                            res.status(201).json({message: 'Event created'})
                        })
                        .catch(function(err){
                            res.status(500).json(err)
                        })
                    } else {
                        res.status(400).json({message: 'Validation failed', errores: validationErrors})
                    }
                }
            } else {
                res.status(404).json({message: 'User was not found'})
            }
        })
    } else {
        res.status(400).json({message: 'User id must be set'})
    }
}

function updateEventById (req, res){

    const id = req.params.idEvent

    CalendarService.getEventById(id)
    .then(function(oldEvent){
        if(oldEvent){
            const event = gettingEventReadyForUpdate(req.body)
            let validationErrors = eventValidation(event, oldEvent)
            
            if(Object.entries(validationErrors).length === 0){
                CalendarService.updateEvent(id, event)
                .then(function(){
                    res.status(200).json({message: 'Event updated'})
                })
                .catch(function(err){
                    res.status(500).json(err)
                })
            } else {
                res.status(400).json({message: 'Validation failed', errores: validationErrors})
            }

        } else {
            res.status(404).json({message: 'Event does not exists'})
        }
    })
}

function deleteEventById (req, res){

    const id = req.params.idEvent

    CalendarService.deleteEvent(id)
    .then(function(){
        res.status(200).json({message: 'Event deleted'})
    })
    .catch(function(err){
        res.status(500).json(err)
    })
}

function replaceEventById (req, res){

    const id = req.params.idEvent
    if(req.body.user_id){
        const idUser = req.body.user_id
    
        UserService.findById(idUser)
        .then(function(user){
            if(user){
                CalendarService.getEventById(id)
                .then(function(eventFound){
                    if(eventFound){

                        if(!req.body.title){

                            res.status(400).json({message: 'To replace an event the title must be set. Options (Flight, Stand-by, Sick Leave, Holidays, Off day, Simulator, Training)'})
                    
                        } else if(typeEvents.indexOf(req.body.title) == -1){
                    
                                res.status(400).json({message: 'The title must be one of the following options: Flight, Stand-by, Sick Leave, Holidays, Off day, Simulator or Training'})
                    
                        } else {

                            const event = gettingEventReady(req.body, req.body.title)
                            let validationErrors = eventValidation(event)

                            if(Object.entries(validationErrors).length === 0){
                                let eventToBeReplaced = {...event, user_id: user._id}
                                CalendarService.replaceEvent(eventFound._id, eventToBeReplaced)
                                .then(function(){
                                    res.status(200).json({message: 'Event replaced'})
                                })
                                .catch(function(err){
                                    res.status(500).json(err)
                                })
                            } else {
                                res.status(400).json({message: 'Validation failed', errores: validationErrors})
                            }
                        }

                    } else {
                        res.status(404).json({message: 'Event does not exists'})
                    }
                })
            } else {
                res.status(404).json({message: 'User was not found'})
            }
        })
    } else {
        res.status(400).json({message: 'User id must be set'})
    }
}

function gettingEventReady(body, title){

    const eventType = typeOfEvent.filter(type => type.name == title)
    const event = {}

    Object.entries(eventType[0]).forEach(([key, value]) => {

        if(key == "name"){
            if(value == "Flight" || value == "Stand-by"){

                if(!body.hasOwnProperty('checkNextDay')){
                    event.checkNextDay = null
                } else if(body.checkNextDay === true || body.checkNextDay === false){
                    event.checkNextDay = body.checkNextDay
                } 
                
            }

            if(value == "Flight"){
                if(!body.hasOwnProperty('layover')){
                    event.layover = null
                } else if(body.layover === true || body.layover === false){
                    event.layover = body.layover
                } 
            }

            if(value == "Sick Leave" || value == "Holidays" || value == "Off day"){
                event.allDay = true
                if(body.start){
                    event.start = body.start
                } else {
                    event.start = null
                }
                
            }
            event.title = value
        }
        if(value && body[key]){
            event[key] = body[key]
        }
    })

    return event
}

function gettingEventReadyForUpdate(body){

    const event = {}

    if(body.start){
    event.start = body.start
    }

    if(body.checkNextDay == false || body.checkNextDay == true){
        event.checkNextDay = body.checkNextDay
    }

    if(body.end){
        event.end = body.end
    }

    if(body.layover == false || body.layover == true){
        event.layover = body.layover
    }

    if(body.title){
        event.title = body.title
    }

    if(body.flightNumber){
        event.flightNumber = body.flightNumber
    }

    if(body.departureAirport){
        event.departureAirport = body.departureAirport
    }

    if(body.arrivalAirport){
        event.arrivalAirport = body.arrivalAirport
    }

    if(body.flightCrew || body.flightCrew == ""){
        event.flightCrew = body.flightCrew
    }

    if(body.allDay){
        event.allDay = body.allDay
    }

    return event
}

const typeEvents = ["Flight","Stand-by", "Sick Leave", "Holidays", "Off day", "Simulator", "Training"]

export {
    findAllEvents,
    findEventById,
    createEvent,
    updateEventById,
    deleteEventById,
    replaceEventById
}