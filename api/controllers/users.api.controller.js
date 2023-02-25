import * as UsersService from '../../services/users.service.js'
import * as TokenService from '../../services/token.service.js'
import * as JWTService from '../../services/jwt.service.js'
import { userFieldValidation } from '../../helpers/userValidation.js'

function login(req, res) {

    let validation = userFieldValidation(req.body, "login")

    if(Object.entries(validation).length === 0){

        const user = {
            email: req.body.loginEmail.toLowerCase(),
            password: req.body.loginPassword
        }
        console.log('entro1', user)
        UsersService.login(user)
        .then(function(user){
            const token = JWTService.createJWTToken(user)
            TokenService.addToDB({ token, user_id: user._id })
            console.log('entro2')
            res.cookie('Crewdule-Auth', token, {httpOnly: true, secure: true, domain: "https://crewdule.vercel.app"})
            console.log('entro3')
            res.status(200).json(user)
        })
        .catch(function(err){
            res.status(500).json({ message: err.message })
        })
    } else {
        res.status(400).json({ message: validation })
    }
}

function logout(req, res) {

    const userToLogOut = {}
    const error = {}

    if(req.body.id){
        userToLogOut.id = req.body.id
    } else {
        error.id = "User id must be set"
    }
    const token = req.cookies['Crewdule-Auth']
    if(token){
        userToLogOut.token = token
    } else {
        error.token = "Token must be set"
    }
    // if(req.body.token){
    //     userToLogOut.token = req.body.token
    // } else {
    //     error.token = "Token must be set"
    // }
    
    if(Object.entries(error).length === 0){
        UsersService.findById(userToLogOut.id)
        .then(function(user){
            if(user){
                TokenService.removeByToken(userToLogOut.token)
                .then(function(response){
                    res.clearCookie('Crewdule-Auth');
                    res.status(200).json({message: 'User was successfully logged out'})
                })
                .catch(function(err){
                    res.status(500).json({ message: err.message })
                })
            } else {
                res.status(404).json({ message: "The user doesn't exists" })
            }
        })
        .catch(function(err){
            res.status(500).json({ message: err.message })
        })
    } else {
        res.status(400).json({ message: error })
    }
}

function findUsers(req, res) {
    const filter = {}
    //const token = req.headers['auth-token']
    const token = req.cookies['Crewdule-Auth']

    if (!token) {
        return res.status(401).json({ message: 'No token was sent' })
    }

    try {
        const payload = JWTService.verifyJWTToken(token)
        console.log(payload)
    }
    catch(err) {
        return res.status(401).json({ message: 'Invalid Token' })
    }

    UsersService.find(filter)
    .then(function(user){
        res.status(200).json(user)
    })
}

function registerUser(req, res) {
    let validation = userFieldValidation(req.body, "register")
    if(Object.entries(validation).length === 0){
        const user = {
            name: req.body.registrationName.toLowerCase(),
            surname: req.body.registrationSurname.toLowerCase(),
            email: req.body.registrationEmail.toLowerCase(),
            jobTitle: req.body.jobTitle,
            airline: req.body.airline ? req.body.airline.toLowerCase() : null,
            airportBase: req.body.airportBase.toLowerCase(),
            password: req.body.registrationPassword,
            avatar: req.body.avatar
        }

        UsersService.register(user)
        .then(function(user){
            res.status(200).json({ message: "Account registered successfully", newUser: user })
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })

    } else {
        res.status(400).json({ message: validation })
    }
}

function deleteUser(req, res) {
    const id = req.params.idUser

    UsersService.remove(id)
    .then(function(){
        res.status(200).json({ message: 'User deleted' })
    })
    .catch(function(err){
        res.status(404).json({ message: err.message })
    })
}

function updateUser(req, res){
    let validation = userFieldValidation(req.body, "update")
    const id = req.params.idUser
    let newInfo = {}

    if(Object.entries(validation).length === 0){
        const key = Object.keys(req.body)[0]
        let value = req.body[Object.keys(req.body)[0]]

        if(key !== 'password'){
            value = value.toLowerCase()
        }

        newInfo[key] = value

        UsersService.update(id, newInfo)
        .then(function(){
            res.status(200).json({ message: 'User updated' })
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })

    } else{
        res.status(400).json({ message: validation })
    }
}

function getUserById(req, res){
    const id = req.params.idUser

    UsersService.findById(id)
    .then(function(user){
        res.status(200).json(user)
    })
    .catch(function(err){
        res.status(404).json({ message: err.message })
    })
}

function updatePassword(req, res){
    
    let validation = userFieldValidation(req.body, "update")
    if(Object.entries(validation).length === 0){
        const email = req.body.email
        const password = req.body.password
        UsersService.findByEmail(email)
        .then(function(user){
            UsersService.update(user._id, {'password': password})
            .then(function(){
                res.status(200).json({ message: 'Password updated' })
            })
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
}

function checkSession(req,res){

    const token = req.cookies['Crewdule-Auth']

    if (!token) {
        return res.status(401).json({ message: 'No token in cookies. No session opened' })
    }

    res.status(200).json({ message: 'Token found in cookies. Session opened' })
}

export {
    login,
    logout,
    findUsers,
    registerUser,
    deleteUser,
    updateUser,
    getUserById,
    updatePassword,
    checkSession
}