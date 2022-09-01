import mongoose from "mongoose";


const studentModels = mongoose.Schema({
    name : {
        type        : String,
        required    : [true, "Name is Required"],
        trim        : true
    },
    username : {
        type        : String,
        required    : [true, "UserName is Required"],
        unique      : true,
        trim        : true
    },
    email : {
        type        : String,
        required    : [true, "Email is Required"],
        unique      : true,
        trim        : true
    },
    cell : {
        type        : String,
        required    : [true, "Cell is Required"],
        unique      : true,
        trim        : true
    },
    age : {
        type        : Number,
        required    : true
    },
    gender : {
        type        : String,
    },
    password : {
        type        : String,
        required    : true,
        trim        : true
    },
    photo : {
        type        : String,
        default     : "avator.png",
    },
    userType : {
        type        : String,
        default     : 'student'
    },
    isAdmin : {
        type        : Boolean,
        default     : false
    },
    status : {
        type        : Boolean,
        default     : true
    },
    trash : {
        type        : Boolean,
        default     : false
    },

},{
    timestamps : true,
});




// mongo model export
export default mongoose.model('Student', studentModels);