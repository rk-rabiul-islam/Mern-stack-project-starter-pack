import express from "express";
import { createStudent, deleteStudent, getAllStudent, getSingleStudent, updateStudent } from "../controllers/student.js";


// routes inti
const Router = express.Router();

// all get routers
Router.route('/').get(getAllStudent).post(createStudent);

// all routes with :id
Router.route('/:id').get(getSingleStudent).put(updateStudent).patch(updateStudent).delete(deleteStudent);



// e
export default Router;