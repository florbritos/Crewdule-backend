import { MongoClient } from 'mongodb'
import { client, DBCREWDULE } from '../constants.js'

//const client = new MongoClient('mongodb://127.0.0.1:27017')
//const client = new MongoClient('mongodb+srv://crewdule:35978540Fb@cluster0.ptdeusi.mongodb.net/test')
//const tokenCollection = client.db('DB_CREWDULE').collection('Tokens')
const tokenCollection = DBCREWDULE.collection('Tokens')

async function addToDB(token) {
    await client.connect()
    await tokenCollection.insertOne(token)
}

async function removeByToken(tokenToDelete) {
    console.log(tokenToDelete)
    await client.connect()
    const result = await tokenCollection.deleteOne(tokenToDelete)
    if (result.deletedCount === 0) {
        throw new Error("The token doesn't exists")
    }
}

async function findByToken(token) {
    await client.connect()
    return await tokenCollection.findOne({ token })
}

export {
    addToDB,
    removeByToken,
    findByToken
}