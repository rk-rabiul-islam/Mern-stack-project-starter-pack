import mongoose from "mongoose";


const tokenModels = mongoose.Schema({

    userId : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : "User",
        required    : true,
    },
    token   : {
        type        : String,
        required    : true
    }

},{
    timestamps : true,
});


// mongo model export
export default mongoose.model('Token', tokenModels);