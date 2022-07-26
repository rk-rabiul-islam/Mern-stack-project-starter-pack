import express from "express";
import { createStudent, deleteStudent, getAllStudent, getSingleStudent, loginStudent, registerStudent, updateStudent } from "../controllers/student.js";
import { authHandler } from "../middlewares/authHandler.js";


// routes inti
const Router = express.Router();

// all get routers
Router.route('/').get( getAllStudent ).post( authHandler, createStudent );

// all routes with :id
Router.route('/:id').get(authHandler, getSingleStudent ).put(  authHandler , updateStudent ).patch( authHandler , updateStudent ).delete( authHandler , deleteStudent );

// User login And Register
Router.route('/register').post(registerStudent);
Router.route('/login').post(loginStudent);



// e
export default Router;