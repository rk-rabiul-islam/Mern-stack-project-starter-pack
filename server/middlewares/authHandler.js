import createError from "../controllers/errorController.js";
import jwt from "jsonwebtoken";


// Atuh Chack User authorized or not
export const authHandler = (req, res, next) => {


    try {

        // Chack Cooki User Token have or not
        const token = req.cookies.access_token;
        if( !token ){
            return next(createError(401, `you are not authorized. !Please Login first`))
        }

        // verify Token for valid or Invalid token
        const loginUser = jwt.verify(token, process.env.SERVER_SECRET);
        if( !loginUser ){
            return next(createError(401, `Invalid Token`))
        }
        
        // All data send to login user
        if( loginUser ){
            req.data = loginUser;
            next();
        }
        
    } catch (error) {
        return next(error);
    }


}