import { userFieldValidation } from '../../helpers/userValidation.js'
import * as UsersService from '../../services/users.service.js'
import * as PasswordService from '../../services/password.service.js'

function sendEmail(req, res){

    let validation = userFieldValidation(req.body, "passwordRecovery")

    if(Object.entries(validation).length === 0){
        const email = req.body.email
        const otp = req.body.otp
        console.log(email, otp)

        UsersService.findByEmail(email)
        .then(function(user){
            PasswordService.sendPasswordRecoveryEmail(email, otp)
            .then(function(response){
                res.status(200).json({ message: 'Email sent succesfully. Check your Inbox.' })
            })
        })
        .catch(err=>{
            res.status(404).json({ message: err.message })
        })
    } else {
        res.status(400).json({ message: validation })
    }

}

export {
    sendEmail,
}