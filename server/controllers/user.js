import bcrypt from "bcryptjs";
import User from "../models/User.js";
import createError from "./errorController.js";
import jwt from "jsonwebtoken";
import { SendEmail } from "../utility/SendEmail.js";
import { SendSms } from "../utility/SendSMS.js";
import { createToken } from "../utility/CreateToken.js";
import Token from "../models/Token.js";

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
 * @access Registeruser users
 * @route /api/user
 * @method Post
 * 
 */
 export const registerUser = async (req, res, next) =>{
    // Create Hash Password
    const solt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, solt);


    try {
        let cell_chack;
        let email_chack;
        let username_chack;

        if(req.body.cell != ""){
            cell_chack = await User.findOne({ cell : req.body.cell})
        }else if(req.body.email != ""){
            email_chack = await User.findOne({ email : req.body.email})
        }
        // Username Chack
        if(req.body.username){
            username_chack = await User.findOne({ username : req.body.username})
        }

        if( cell_chack){
            next(createError(401, 'Phone Number already exist'))
        }else if(email_chack){
            next(createError(401, 'Email already exist'))
        }else if(username_chack){
            next(createError(401, 'UserName already exist'))
        }else{

           const user = await User.create({...req.body, password : hash_pass,});
        
            // Create Token 
            const token = createToken({id : user._id});
            // User Verify Link Gen
            const verifyLink = `http://localhost:3000/user/${user._id}/${token}`;

            // token update
            await Token.create({userId : user._id, token : token})
            
            // Send Verify link for user
            user.cell ? SendSms(user.cell, `${verifyLink}`) : "";
            user.email ? SendEmail(user.email, "My Instagram Account Verify Link", `${verifyLink}`) : "";

            res.status(200).json({
                userData : user
            });

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
 export const loginUser = async (req, res, next) =>{

    const { authInput } = req.body

    try {

        // Chack User By Emal
        const emailChack = await User.findOne({ email : authInput });
        // Chack User By UserName
        const cellChack = await User.findOne({ cell : authInput });

        /**
         * Login User Chack Email or UserName or Cell
         */
        const loginUserData = emailChack ? emailChack :  cellChack;
        
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


export const loginUserInfo = async (req, res, next) =>{

    try {

        const getToken = req.headers.authorization;

        let token = "";

        if( getToken ){
            token = getToken.split(' ')[1];

            // Token Verify
            const loginUser = jwt.verify(token, process.env.SERVER_SECRET);
            // if token not match our server token
            if( !loginUser ){
                return next(createError(400, 'Invalid Token'))
            }
            // user chack
            if( loginUser ){
                const user = await User.findById(loginUser.id);
                res.status(200).json(user);
            }

        }
        if( !getToken ){
            return next(createError(400, 'Token Not Found'))
        }

        
    } catch (error) {
        next(error);
    }

}


/**
 * @access Verify User Account
 * @route /api/user/verify
 * @method Post
 * 
 */
export const verifyUserAccount = async (req, res, next) => {

    try {
        
        const {id, token} = req.body;
        const verify = await Token.findOne({id : id, token : token})

        // chack verify link
        if( !verify ){
            next(createError(404, 'Invalid Verify link'));
        }
        // verify user
        if( verify ){
            await User.findByIdAndUpdate(id, {
                isVerified  : true
            });
            res.status(200).json({ message : 'User Account Verify successfull' });
            verify.remove();
        }

    } catch (error) {
        next(error)
    }
}


/**
 * @access if User forgot Password his Account
 * @route /api/user/forgotPassword
 * @method Post
 * 
 */

export const forgotPassword = async(req, res, next) =>{

    const {cell, email} = req.body;

    let recover_password;
    try {

        // if user use Phone number for Reset Password
        if(!cell == ""){
            recover_password = await User.findOne({cell});

            if( recover_password){
                const token = createToken({ id : recover_password._id},'5m')
                const recoveryUrl = `http://localhost:3000/password/reset/${token}`;
                await SendSms(recover_password.cell, "Instagram", recoveryUrl);
                res.status(202).json({message : 'Recovery OtpCode Send'});
            }
        }
        // if your use Email for Reset password
        if(!email == ""){
            recover_password = await User.findOne({email});

            if( recover_password){
                const token = createToken({ id : recover_password._id})
                const recoveryUrl = `http://localhost:3000/password/reset/${token}`;
                await SendEmail(recover_password.email, "Instagram Account Password Recover Link", recoveryUrl);
                res.status(202).json({message : 'Recovery Link Send'});
            }

        }
        // if User data not found
        if(!recover_password){
            res.status(404).json({message : 'User Not Found'});
        }

    } catch (error) {
        next(error);
    }
}
/**
 * @access if User forgot Password his Account
 * @route /api/user/forgotPassword
 * @method Post
 * 
 */

export const resetPassword = async(req, res, next) =>{

    
    try {
        const {token, password} = req.body;
        // Chack Token is Valide or not
        const {id} = jwt.verify(token, process.env.SERVER_SECRET);

        // create Password solt 
        const solt = await bcrypt.genSalt(10);
        const hash_pass = await bcrypt.hash(req.body.password, solt);
        
        if( id ){
            // Chack User valide or not
            await User.findByIdAndUpdate(id, {password : hash_pass});
            res.status(200).json({message : 'user password Change successfully'});
        }
        
    } catch (error) {
        next(error);
    }
}