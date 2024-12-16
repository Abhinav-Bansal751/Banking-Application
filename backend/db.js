const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/')

const userSchema = mongoose.schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


export const userModel = new mongoose.model('userModel',userSchema)

