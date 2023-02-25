import express from 'express'
import * as UsersApiController from '../controllers/users.api.controller.js'
import * as PasswordRecoveryApiController from '../controllers/passwordRecovery.api.controller.js'

const route = express.Router()

route.route('/api/account/session')
    .post(UsersApiController.login)
    .delete(UsersApiController.logout)
    .get(UsersApiController.checkSession)

route.route('/api/users')
    .get(UsersApiController.findUsers)
    .post(UsersApiController.registerUser)

route.route('/api/users/:idUser')
    .get(UsersApiController.getUserById)
    .delete(UsersApiController.deleteUser)
    .patch(UsersApiController.updateUser)

route.route('/api/passwordRecovery')
    .post(PasswordRecoveryApiController.sendEmail)
    .patch(UsersApiController.updatePassword)

export default route