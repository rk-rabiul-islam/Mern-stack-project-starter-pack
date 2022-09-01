import mongoose from "mongoose";


const userModels = mongoose.Schema({
    name : {
        type        : String,
        required    : [true, "Name is Required"],
        trim        : true
    },
    username : {
        type        : String,
        trim        : true
    },
    email : {
        type        : String,
        trim        : true
    },
    cell : {
        type        : String,
        trim        : true
    },
    age : {
        type        : String,
        required    : true
    },
    gender : {
        type        : String,
        required    : true
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
        default     : 'user'
    },
    isVerified : {
        type        : Boolean,
        default     : false
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
export default mongoose.model('User', userModels);