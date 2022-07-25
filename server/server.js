import express  from "express";
import dotenv from "dotenv";
import colors from "colors";
import studentRouts from "./routes/student.js"
import userRouts from "./routes/user.js"
import mongoDBConnect from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";


// Express inti
const app = express();
dotenv.config();

// 
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

// inti env variabels
const PORT = process.env.SERVER_PORT || 5000;

// all main routes work
app.use('/api/student', studentRouts);
app.use('/api/user', userRouts);



// Express Error Handler
app.use(errorHandler);



// inti listener for server run port
app.listen(PORT, () => {
    mongoDBConnect();
    console.log(`server is running on PORT "http://localhost:${PORT}/"`.bgGreen.black);
});