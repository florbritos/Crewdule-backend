import { MongoClient, ObjectId } from 'mongodb'
import * as PasswordService from './password.service.js'

//const client = new MongoClient('mongodb://127.0.0.1:27017')
const client = new MongoClient('mongodb+srv://crewdule:35978540Fb@cluster0.ptdeusi.mongodb.net/test')
const usersCollection = client.db('DB_CREWDULE').collection('Users')

async function login({ email, password }) {

    await client.connect()
    const user = await usersCollection.findOne({ email })

    if (!user) {
        throw new Error('Email not registered')
    }

    const isMatch = await PasswordService.verifyPassword(password, user.password)

    if (!isMatch) {
        throw new Error('Incorrect password')
    }

    return user
}

async function find(filter) {
    await client.connect()
    return await usersCollection.find(filter).toArray()
}

async function findById(id) {
    await client.connect()
    return await usersCollection.findOne({_id: new ObjectId(id)})
}

async function findByEmail(userEmail){
    await client.connect()
    const userExists = await usersCollection.findOne({ email: userEmail })
    if (!userExists) {
        throw new Error('Email is not registered')
    }
    return userExists
}

async function register(user) {
    const newUser = { ...user }

    await client.connect()
    const userExists = await usersCollection.findOne({ email: newUser.email })

    if (userExists) {
        throw new Error('Email is already registered')
    }

    const salt = await PasswordService.passwordSalting()
    newUser.password = await PasswordService.passwordHash(newUser.password, salt)

    await usersCollection.insertOne(newUser)

    return newUser
}

async function remove(id) {

    await client.connect()
    const result = await usersCollection.deleteOne({ _id: ObjectId(id) })

    if (result.deletedCount === 0) {
        throw new Error("The user doesn't exists")
    }
}

async function update(id, newInfo){

    const fieldToUpdate = {...newInfo}

    await client.connect()

    if(fieldToUpdate.hasOwnProperty('email')){
        const userExists = await usersCollection.findOne({ email: fieldToUpdate.email })
        if (userExists) {
            throw new Error('Email is already registered')
        }
    }

    if(fieldToUpdate.hasOwnProperty('password')){

        const salt = await PasswordService.passwordSalting()
        fieldToUpdate.password = await PasswordService.passwordHash(fieldToUpdate.password, salt)
    }

    const result = await usersCollection.updateOne({
        _id: new ObjectId(id)
    }, {
        $set: fieldToUpdate
    })

    if (result.modifiedCount === 0) {
        throw new Error("The user doesn't exists")
    }
}

export {
    login,
    find,
    findById,
    findByEmail,
    register,
    remove,
    update
}