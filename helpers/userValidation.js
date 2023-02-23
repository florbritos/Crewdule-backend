import { isOnlyAlphabetLetters } from "./alphabeticLettersValidation.js";

function validationRules(field,value){

    let error = null

    switch (field) {
        
        case "email":
            if(typeof(value) !== "string"){
                error = "Email must be type String"
            } else if(value.trim() == 0){
                error = "Email must be set"
            } else if(!isEmail(value)){
                error = "Email must be type email (email@domain.com)"
            }
            break;

        case "password":
            if(typeof(value) !== "string"){
                error = "Password must be type String"
            } else if(value.trim() == 0){
                error = "Password must be set"
            }
            break;

        case "name":
            if(typeof(value) !== "string"){
                error = "First name must be type String"
            } else if(value.trim() == 0){
                error = "Name must be set"
            }
            break;

        case "surname":
            if(typeof(value) !== "string"){
                error = "Last name must be type String"
            } else if(value.trim() == 0){
                error = "Last name must be set"
            }
            break;
        
        case "airportBase":
            if(typeof(value) !== "string"){
                error = "Designated airport must be type String"
            } else if(value.trim() == 0){
                error = "Designated airport must be set"
            } else if(!isOnlyAlphabetLetters(value)){
                error = 'Designated airport must contain only alphabetic letters (ICAO code).'
            } else if( value.length !== 4){
                error = 'Designated airport must have 4 letters (ICAO code).';
            }
            break;
        
        case "otp":
            if(typeof(value) == "string"){
                error = "OTP must be all numbers"
            } else if(value == null){
                error = "OTP must be set"
            }else if(!parseInt(value)){
                error = "OTP must be all numbers"
            } else if(value.toString().length !== 4){
                error = "OTP must be only 4 numbers"
            }
            break;
    
        default:
            break;
    }

    return error
}


export function userFieldValidation(body, action){

    let errors = {}

    if(action == "login"){
        if(!body.loginEmail){
            errors.loginEmail = "Email must be set"
        } else {
            let error = validationRules("email",body.loginEmail)
            if(error){
                errors.loginEmail = error
            }
        }

        if(!body.loginPassword){
            errors.loginPassword = "Password must be set"
        } else {
            let error = validationRules("password", body.loginPassword)
            if(error){
                errors.loginPassword = error
            }
        }
    }

    if(action == "register"){
        if(!body.registrationEmail){
            errors.registrationEmail = "Email must be set"
        } else {
            let error = validationRules("email", body.registrationEmail)
            if(error){
                errors.registrationEmail = error
            }
        }

        if(!body.registrationPassword){
            errors.registrationPassword = "Password must be set"
        } else {
            let error = validationRules("password", body.registrationPassword)
            if(error){
                errors.registrationPassword = error
            }
        }

        if(!body.registrationName){
            errors.registrationName = "First name must be set"
        } else {
            let error = validationRules("name", body.registrationName)
            if(error){
                errors.registrationName = error
            }
        }

        if(!body.registrationSurname){
            errors.registrationSurname = "Last name must be set"
        } else {
            let error = validationRules("surname", body.registrationSurname)
            if(error){
                errors.registrationSurname = error
            }
        }

        if(!body.airportBase){
            errors.airportBase = "Designated airport must be set"
        } else {
            let error = validationRules("airportBase", body.airportBase)
            if(error){
                errors.airportBase = error
            }
        }
    }

    if(action == "update"){

        const key = Object.keys(body)[0]
        const value = body[Object.keys(body)[0]]
        let error = validationRules(key, value)
        if(error){
            errors[Object.keys(body)[0]] = error
        }
    }

    if(action == "passwordRecovery"){
        if(!body.email){
            errors.email = "Email must be set"
        } else {
            let error = validationRules("email",body.email)
            if(error){
                errors.email = error
            }
        }

        if(!body.otp){
            errors.otp = "Email must be set"
        } else {
            let error = validationRules("otp",body.otp)
            if(error){
                errors.otp = error
            }
        }
    }
    
    return errors
}

function isEmail(str){
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(str)){
        return false
    } else {
        return true
    }
}