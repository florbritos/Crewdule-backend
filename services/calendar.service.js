import { ObjectId} from 'mongodb'
import { client, DBCREWDULE } from '../constants.js'

//const client = new MongoClient('mongodb://127.0.0.1:27017')
// const client = new MongoClient('mongodb+srv://crewdule:35978540Fb@cluster0.ptdeusi.mongodb.net/test')
const calendarCollection = DBCREWDULE.collection('Calendar')

async function getAllEvents(filter = {}){

    if(filter.idUser){
        filter = {user_id : ObjectId(filter.idUser)}
    }

    return client.connect()
    .then(async function(){
        return calendarCollection.find(filter).toArray()
    })
    .catch(function(err){
        return []
    })
}

async function getEventById(id){
    return client.connect()
    .then(function(){
        return calendarCollection.findOne({_id: new ObjectId(id)})
    })
}

async function saveNewEvent(event){

    const newEvent= {...event}

    return client.connect()
    .then(function(){
        return calendarCollection.insertOne(newEvent)
    })

}

async function updateEvent(id, event){

    return client.connect()
    .then(function(){
        return calendarCollection.updateOne({
            _id: new ObjectId(id)
        }, {
            $set: event
        })
    })
}

async function replaceEvent(id, event){

    return client.connect()
    .then(function(){
        return calendarCollection.replaceOne({_id: new ObjectId(id)}, event)
    })
}

async function deleteEvent(id){

    return client.connect()
    .then(function(){
        return calendarCollection.deleteOne({_id: new ObjectId(id)})
    })
}

export {
    getAllEvents,
    getEventById,
    saveNewEvent,
    updateEvent,
    replaceEvent,
    deleteEvent
}