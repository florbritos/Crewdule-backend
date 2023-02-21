import * as UsersService from '../services/users.service.js'
import * as TokenService from '../services/token.service.js'
import jwt from 'jsonwebtoken'

function hasToken(req, res, next) {
    console.log('se ejecuto')

    const token = req.headers['auth-token']

    if (!token) {
        return res.status(401).json({ message: 'No token was sent' })
    }

    try {
        const payload = jwt.verify(token, 'SECRETKEY')
        TokenService.findByToken(token)
        .then(function(token){
            if (token) {
                UsersService.findById(payload.id)
                .then(function(user){
                    req.user = user
                    next()
                })
            }
            else {
                res.status(401).json({ message: 'Invalid Token' })
            }
        })
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid Token' })
    }

}

export {
    hasToken,
}