import Student from "../models/student.js";
import bcrypt from "bcryptjs";
import createError from "./errorController.js";
import jwt from "jsonwebtoken";


/**
 * @access public
 * @route /api/student
 * @method GET
 * 
 */
export const getAllStudent = async (req, res, next) =>{

    try {
        const students = await Student.find();
        if( !students ){
            return next(createError(404, 'No Data Found'))
        }
        if(students){
            res.status(200).json(students);
        }

    } catch (error) {
        next(error);
    }
}


/**
 * @access public
 * @route /api/student/:id
 * @method GET
 * 
 */
export const getSingleStudent = async (req, res, next) =>{

    try {
        const student = await Student.findById(req.params.id);

        if( !student ){
            return next(createError(404, 'No Data Found'))
        }

        if(student){
            res.status(302).json(student);
        }

    } catch (error) {
        next(error);
    }
}


/**
 * @access login users
 * @route /api/student
 * @method Post
 * 
 */
export const createStudent = async (req, res, next) =>{

    const solt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, solt);


    try {
        const student = await Student.create({...req.body, password : hash_pass});
        res.status(201).json(student);
    
    } catch (error) {
            next(error);
    }
}

/**
 * @access login users
 * @route /api/student/:id
 * @method put/patch
 * 
 */
export const updateStudent = async (req, res, next) =>{

    const {id} = req.params

    try {
        const student = await Student.findByIdAndUpdate(id, req.body, {new : true});

        if( !student ){

            return next(createError(404, 'No Data Found For UpDate'))
        }
        if(student){
            res.status(200).json(student);
        }


    } catch (error) {
        next(error);
    }

}

/**
 * @access login users
 * @route /api/student/:id
 * @method Post
 * 
 */
export const deleteStudent = async (req, res, next) =>{

    const {id} = req.params


    try {
       const student = await Student.findByIdAndDelete(id);

        if( !student ){
            return next(createError(404, 'No Data Found For Delete'))
        }
        if(student){
            res.status(200).json(student);
        }

    } catch (error) {
        next(error);
    }
}


/**
 * @access Registeruser users
 * @route /api/student
 * @method Post
 * 
 */
 export const registerStudent = async (req, res, next) =>{

    const solt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, solt);


    try {
        const student = await Student.create({...req.body, password : hash_pass});
        res.status(201).json(student);
    
        } catch (error) {
            next(error);
        }
}


/**
 * @access login Student
 * @route /api/Student
 * @method Post
 * 
 */
 export const loginStudent = async (req, res, next) =>{

    const { data } = req.body

    try {

        // Chack User By Emal
        const emailChack = await Student.findOne({ email : data });
        // Chack User By UserName
        const userNameChack = await Student.findOne({ username : data });
        // Chack User By UserName
        const cellChack = await Student.findOne({ cell : data });

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