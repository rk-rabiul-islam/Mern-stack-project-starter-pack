import jwt from "jsonwebtoken"



// Create JWT Token
export const createToken = (data, expire = '3d') => {
    return jwt.sign(data, process.env.SERVER_SECRET, {
        expiresIn : expire
    })
}