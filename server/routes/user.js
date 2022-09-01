import express from "express";
import {  createUser, deleteUser, getAllUser, getSingleUser, loginUser, loginUserInfo, registerUser, updateUser, verifyUserAccount, forgotPassword, resetPassword } from "../controllers/user.js";
import { authHandler } from "../middlewares/authHandler.js";


// routes inti
const Router = express.Router();

// User login And Register
Router.route('/register').post(registerUser);
Router.route('/login').post(loginUser);
Router.route('/me').get(loginUserInfo);
Router.route('/verify').post(verifyUserAccount);
Router.route('/forgot_password').post(forgotPassword);
Router.route('/reset_password').post(resetPassword);

// all get routers
Router.route('/').get(getAllUser).post(  authHandler, createUser);

// all routes with :id
Router.route('/:id').get( authHandler, getSingleUser).put(  authHandler, updateUser).patch( authHandler, updateUser).delete( authHandler, deleteUser);


// export router
export default Router;