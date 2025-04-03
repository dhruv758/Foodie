const mongoose = require("mongoose");

const verifyUser = new mongoose.Schema({

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

})
const verifyUserSchema = new mongoose.model("verify-users", verifyUser);
module.exports = verifyUserSchema;