import bcrypt from "bcryptjs";
import User from "../models/User.js";
import createError from "./errorController.js";
import jwt from "jsonwebtoken";

/**
 * @access public
 * @route /api/user
 * @method GET
 * 
 */
export const getAllUser = async (req, res, next) =>{

    try {
        const users = await User.find();
        if( !users ){
            return next(createError(404, 'No Data Found'))
        }
        if(users){
            res.status(200).json(users);
        }

    } catch (error) {
        next(error);
    }
}


/**
 * @access public
 * @route /api/user/:id
 * @method GET
 * 
 */
export const getSingleUser = async (req, res, next) =>{

    try {
        const user = await User.findById(req.params.id);

        if( !user ){
            return next(createError(404, 'No Data Found'))
        }

        if(user){
            res.status(302).json(user);
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
export const createUser = async (req, res, next) =>{

    const solt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, solt);


    try {
        const user = await User.create({...req.body, password : hash_pass});
        res.status(201).json(user);
    
        } catch (error) {
            next(error);
        }
}

/**
 * @access login users
 * @route /api/user/:id
 * @method put/patch
 * 
 */
export const updateUser = async (req, res, next) =>{

    const {id} = req.params

    try {
        const user = await User.findByIdAndUpdate(id, req.body, {new : true});

        if( !user ){

            return next(createError(404, 'No Data Found For UpDate'))
        }
        if(user){
            res.status(200).json(user);
        }


    } catch (error) {
        next(error);
    }

}

/**
 * @access login users
 * @route /api/user/:id
 * @method Post
 * 
 */
export const deleteUser = async (req, res, next) =>{

    const {id} = req.params


    try {
       const user = await User.findByIdAndDelete(id);

        if( !user ){
            return next(createError(404, 'No Data Found For Delete'))
        }
        if(user){
            res.status(200).json(user);
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
 export const registerUser = async (req, res, next) =>{

    const solt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, solt);


    try {
        const user = await User.create({...req.body, password : hash_pass});
        res.status(201).json(user);
    
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
 export const loginUser = async (req, res, next) =>{

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
        const token = jwt.sign({ id : loginUserData._id, isAdmin : loginUserData.isAdmin }, process.env.SERVER_SECRET);

        const { _id, password, isAdmin, trash, status, ...userInFo } = loginUserData._doc;

        res.cookie('access_token', token).status(200).json({
            token : token,
            user : userInFo
        });

    
        } catch (error) {
            next(error);
        }
}