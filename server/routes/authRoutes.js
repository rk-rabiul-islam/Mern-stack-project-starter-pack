import express from "express";
import { loginMember, registerMember } from "../controllers/authController.js";


// routes inti
const Router = express.Router();

// User login And Register
Router.route('/register').post(registerMember);
Router.route('/login').post(loginMember);

// export router
export default Router;