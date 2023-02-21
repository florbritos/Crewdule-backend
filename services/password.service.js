import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import {generateEmailTemplate} from '../emails/recoveryPassword.js'

async function verifyPassword(password, actualPassword){
    const isMatch = await bcrypt.compare(password, actualPassword)
    return isMatch
}

async function passwordSalting(){
    const salt = await bcrypt.genSalt(10)
    return salt
}

async function passwordHash(password, salt){
    const newPassword = await bcrypt.hash(password, salt)
    return newPassword
}

async function sendPasswordRecoveryEmail(email, otp){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'florencia.britos@davinci.edu.ar',
            pass: 'sqzuyywqtqynckzh',
        },
    })

    const mail_configs = {
        from: 'florencia.britos@davinci.edu.ar',
        to: email,
        subject: "Crewdule - PASSWORD RECOVERY",
        html: generateEmailTemplate(otp),
    };

    const emailSent = await transporter.sendMail(mail_configs) 
    return emailSent
    // function (error, info) {
    //     if (error) {
    //         console.log(error);
    //         throw new Error('An error has occured')
    //     }
    //     return resolve({ message: "Email sent succesfuly" })
    // });

}

export {
    verifyPassword,
    passwordSalting,
    passwordHash,
    sendPasswordRecoveryEmail
}