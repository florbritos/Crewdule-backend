import { isOnlyAlphabetLetters } from "./alphabeticLettersValidation.js";
import { typeOfEvent } from "./data.js";

function validationRules(key, eventInfo, errorMessage){

    switch(key){
        case "start":
            if(!eventInfo[key] || eventInfo[key] === null){
                errorMessage = 'Starting time must be set.';
            } else if(!isIsoDate(eventInfo[key])) {
                errorMessage = 'Starting time must be ISO format (yyy-mm-ddThh:mm:ss.000Z)';
            } else if (!eventInfo.checkNextDay){
                if(eventInfo[key] > eventInfo.end ){
                    errorMessage = 'Starting time must be prior than the ending time.'
                } else if(
                        
                        new Date(eventInfo[key]).getFullYear() == new Date(eventInfo.end).getFullYear() &&
                        new Date(eventInfo[key]).getMonth() == new Date(eventInfo.end).getMonth() &&
                        new Date(eventInfo[key]).getDate() !== new Date(eventInfo.end).getDate()
                    ){
                        errorMessage = 'Starting time and Ending time must be the same day.'
                }
                
            } else if(eventInfo.checkNextDay){
                if(
                    new Date(eventInfo[key]).getFullYear() == new Date(eventInfo.end).getFullYear() &&
                    new Date(eventInfo[key]).getMonth() == new Date(eventInfo.end).getMonth() &&
                    new Date(eventInfo[key]).getDate() + 1 !== new Date(eventInfo.end).getDate()
                ){
                    errorMessage = {
                        'msg' : "The Ending time should be set to one day ahead of Starting Time only." + (new Date(eventInfo[key])).toString() + '--' + (new Date(eventInfo.end)).toString(),
                        'msg1': new Date(eventInfo[key]).getFullYear() == new Date(eventInfo.end).getFullYear(),
                        'msg2': new Date(eventInfo[key]).getMonth() == new Date(eventInfo.end).getMonth(),
                        'msg3': new Date(eventInfo[key]).getDate() + 1 !== new Date(eventInfo.end).getDate(),
                    }
                }
            }
            break;

        case "end":
            if(!eventInfo[key]){
                errorMessage =  'Ending time must be set.';
            } else if(!isIsoDate(eventInfo[key])) {
                errorMessage = 'Starting time must be ISO format (yyy-mm-ddThh:mm:ss.000Z)';
            } else if(!eventInfo.checkNextDay){
                if(eventInfo[key] < eventInfo.start){
                    errorMessage = 'Ending time must be later than the start time.';
                } else if(
                        new Date(eventInfo[key]).getFullYear() == new Date(eventInfo.start).getFullYear() &&
                        new Date(eventInfo[key]).getMonth() == new Date(eventInfo.start).getMonth() &&
                        new Date(eventInfo[key]).getDate() !== new Date(eventInfo.start).getDate()
                    ){
                        errorMessage = 'Starting time and Ending time must be the same day.'
                }
                
            } else if(eventInfo.checkNextDay){
                if(
                    new Date(eventInfo[key]).getFullYear() == new Date(eventInfo.start).getFullYear() &&
                    new Date(eventInfo[key]).getMonth() == new Date(eventInfo.start).getMonth() &&
                    new Date(eventInfo[key]).getDate() -1 !== new Date(eventInfo.start).getDate()
                ){
                    errorMessage = "The Ending time should be set to one day ahead of Starting Time only." + (new Date(eventInfo[key])).toString()
                }
            }
            break;

        case "flightNumber":
            if(!eventInfo[key]){
                errorMessage = 'Flight number must be set.';
            } else if (eventInfo[key].trim().length == 0 ){
                errorMessage = 'Flight number must be set.';
            }
            break;

        case "departureAirport":
            if(!eventInfo[key]){
                errorMessage = 'Departure Airport must be set.';
            }else if(eventInfo[key].trim().length !== 4 ){
                errorMessage = 'Departure airport must have 4 letters (ICAO code).';
            }else if(!isOnlyAlphabetLetters(eventInfo[key])){
                errorMessage = 'Departure airport must contain only alphabetic letters (ICAO code).';
            }
            break;

        case "arrivalAirport":
                if(!eventInfo[key]){
                    errorMessage = 'Arrival Airport must be set.';
                }else if(eventInfo[key].trim().length !== 4){
                    errorMessage = 'Arrival airport must have 4 letters (ICAO code).';
                }else if(!isOnlyAlphabetLetters(eventInfo[key])){
                    errorMessage = 'Arrival airport must contain only alphabetic letters (ICAO code).';
                }
            break;
            default:  
    }

    return errorMessage
}


export function eventValidation(event, oldEvent){

    let errors = {}
    let eventToCheck = {};

    if(oldEvent){
        eventToCheck = {...oldEvent}

        Object.entries(event).forEach(([key, value]) => {
            eventToCheck[key] = value
        })
        
    } else {
        eventToCheck  = {...event}
    }

    const eventType = typeOfEvent.filter(type => type.name == eventToCheck.title)

    Object.entries(eventType[0]).forEach(([key, value]) => {

        let errorMessage = ""

        if(key == "name"){

            if(value == "Sick Leave" || value == "Holidays" || value == "Off day"){
                if(eventToCheck.start === null){
                    errors.start = 'Starting time must be set.'
                } else if(!isIsoDate(eventToCheck.start)){
                    errors.start = 'Starting time must be ISO format (yyy-mm-ddThh:mm:ss.000Z)';
                }
            }

            if(value == "Flight" || value == "Stand-by"){
                if(eventToCheck.checkNextDay === true || eventToCheck.checkNextDay === false){
                    //event.checkNextDay = eventToCheck.checkNextDay
                } else if(eventToCheck.checkNextDay == null){
                    errors.checkNextDay = 'CheckNextDay must be set and has to be type Boolean.'
                }
            }

            if(value == "Flight"){
                if(eventToCheck.layover === true || eventToCheck.layover === false){
                    //event.layover = eventToCheck.layover
                } else if(eventToCheck.layover == null){
                    errors.layover = 'Layover must be set and has to be type Boolean.'
                }
            }
            
        }

        if(value == true){
            errorMessage = validationRules(key, eventToCheck, errorMessage)
            if(errorMessage.length !== 0){
                errors[key] = errorMessage
            }
        }
    })

    return errors
}


function isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
    const d = new Date(str); 
    return d instanceof Date && !isNaN(d) && d.toISOString() === str;
}
