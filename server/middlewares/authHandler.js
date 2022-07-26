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


        // Verify User data for access ability 
        const isAdminChack = loginUser.isAdmin;
        const userIdChack = loginUser.id == req.params.id;
        /**
         * If the user is an administrator he can access and delete every data
         *  but if he is not then he only accesses his own data.
         */
        const authorized = isAdminChack ? isAdminChack : userIdChack;

        // Verify User data for access to update or delete data
        if( !authorized ){
            return next(createError(401, "You cannot access this feature"));
        }
        
        // All data send to login user
        if( authorized ){
            req.data = loginUser;
            next();
        }
        
    } catch (error) {
        return next(error);
    }


}