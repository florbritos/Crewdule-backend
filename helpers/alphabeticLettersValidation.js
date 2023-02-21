export function isOnlyAlphabetLetters(str){
    
    if(!/^[A-Za-z]+$/.test(str)){
        return false
    } else {
        return true
    }
}