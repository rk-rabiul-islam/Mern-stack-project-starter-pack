import express from "express";
import {  createUser, deleteUser, getAllUser, getSingleUser, loginUser, registerUser, updateUser } from "../controllers/user.js";
import { authHandler } from "../middlewares/authHandler.js";


// routes inti
const Router = express.Router();

// all get routers
Router.route('/').get(getAllUser).post(createUser);

// all routes with :id
Router.route('/:id').get(getSingleUser).put(authHandler, updateUser).patch(authHandler, updateUser).delete( authHandler, deleteUser);

// User login And Register
Router.route('/register').post(registerUser);
Router.route('/login').post(loginUser);

// export router
export default Router;