import student from "../models/student.js";
import User from "../models/User.js";
import createError from "./errorController.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


/**
 * @access Registeruser users
 * @route /api/user
 * @method Post
 * 
 */
 export const registerMember = async (req, res, next) =>{

    // genaret solt for password
    const solt = await bcrypt.genSalt(10);
    // Hash passeord
    const hash_pass = await bcrypt.hash(req.body.password, solt);


    try {

        const memberType = req.body.userType;

        // Creat a User
        if(memberType === 'user'){
            const user = await User.create({...req.body, password : hash_pass});
            res.status(201).json(user);
        }

        // Creat a student
        if(memberType === 'student'){
            const user = await student.create({...req.body, password : hash_pass});
            res.status(201).json(user);
        } 

        // Creat a student
        if(memberType !== 'student' || 'user'){
            return next(createError(401, 'User Data Not Found'))
        }               

    
    } catch (error) {
            next(error);
    }
}


/**
 * @access login users
 * @route /api/user
 * @method Post
 * 
 */
 export const loginMember = async (req, res, next) =>{

    const { data } = req.body

    try {

        // Chack User By Emal
        const emailChack = await User.findOne({ email : data });
        // Chack User By UserName
        const userNameChack = await User.findOne({ username : data });
        // Chack User By UserName
        const cellChack = await User.findOne({ cell : data });

        /**
         * Login User Chack Email or UserName or Cell
         */
        const loginUserData = emailChack ? emailChack : ( userNameChack ? userNameChack : cellChack);
        
        // user Email Chack exists or not
        if( !loginUserData ){
            return next(createError(404, 'User Data Not Found'))
        }

        // Chack User password
        const userPassword = await bcrypt.compare(req.body.password, loginUserData.password);
        
        // user Email Chack exists or not
        if( !userPassword ){
            return next(createError(404, `User Password Not Match. !Please try Again Later`))
        }

        // Create token For User
        const token = jwt.sign({ id : loginUserData._id, userType : loginUserData.userType, isAdmin : loginUserData.isAdmin }, process.env.SERVER_SECRET);

        const { _id, password, isAdmin, trash, status, ...userInFo } = loginUserData._doc;

        res.cookie('access_token', token).status(200).json({
            token : token,
            user : userInFo
        });

    
    } catch (error) {
            next(error);
    }
}