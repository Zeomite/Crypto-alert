const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid')

const userSchema = mongoose.Schema({
    _id:{
        type : String,
        required: true,
        default: uuidv4 
    },
    password: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required : true
    }, 
    targetPrices: {
        type: Map,
        of: Number,
        default: {}
    }
});

module.exports = mongoose.model("User", userSchema);