const mongoose = require("mongoose");

const user = new mongoose.Schema({

    userName:{
        type:String,
        
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    otp:{
        type:Number,
    }
})
const userSchema = new mongoose.model("users", user);
module.exports = userSchema;