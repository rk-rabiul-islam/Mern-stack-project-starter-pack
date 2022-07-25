import Student from "../models/student.js";
import bcrypt from "bcryptjs";
import createError from "./errorController.js";

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