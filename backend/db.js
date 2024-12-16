const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/paytm')

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


const accountSchema = mongoose.schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,//will contain an objectId which refers to User table
        ref:'User',
        required: true
    },
    balance:{
        type:Number,
        required:true,
        min: 0 // Ensures balance cannot be negative
    }
})


export const userModel = new mongoose.model('userModel',userSchema)
export const accountModel = new mongoose.model('accountModel',accountSchema)

