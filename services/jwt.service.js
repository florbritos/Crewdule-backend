import jwt from 'jsonwebtoken'

function createJWTToken(user){

    const token = jwt.sign({ id: user._id, email: user.email }, 'SECRETKEY')
    return token
}

function verifyJWTToken(token){
    
    const isVerified = jwt.verify(token, 'SECRETKEY')
    return isVerified
}

export {
    createJWTToken,
    verifyJWTToken,
}