const express = require('express');
import { z } from 'zod';
import { userModel } from '../db';
import { JWT_SECRET } from '../config';
import { authMiddleware } from '../middleware';
const app = express();

const userRouter = express.Router();

export const signupSchema = z.object({
    firstName:z.string(),
    email:z.string().email,
    password:z.string().min(8),
})

export const signinSchema = z.object({
    email:z.string().email(),
    password:z.string().min(8),
})

userRouter.post('/signup',async (req,res) =>{
    const body = req.body;
    const {sucess} = signupSchema.safeParse(req.body);
    
    if(!sucess){
        return res.status(411).json({
            message:"email already taken or invalid input"
        })
    }

    try {
        
        const existingUser = await userModel.findOne({
            email:req.body.email,
        })
    
        if(existingUser) {
            res.status(200).send("user already exist")
        }
    
        const user = await userModel.create({
            email:body.email,
            firstName:body.firstName,
            lastName:body.lastName,
            password:body.passsword,
        })
    
        const userId = user._id;
    
        const token = jwt.sign({userId},JWT_SECRET);

        res.json({
            message:"user created successfully",
            token
        })


    } catch (error) {
        console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

})


// Sign-in route
userRouter.post('/signin', async (req, res) => {
    const body = req.body;
  
    // Validate the request body
    const { success, data, error } = signinSchema.safeParse(body);
  
    if (!success) {
      return res.status(400).json({
        message: "Invalid input",
        error: error.errors, // Send validation errors back to the user
      });
    }
  
    try {
      // Find the user by email
      const user = await userModel.findOne({ email: data.email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the password matches
      const isPasswordMatch = user.password === data.password; // Use hashing (e.g., bcrypt) in a real app
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
      return res.status(200).json({
        message: "Sign-in successful",
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });



export const updateSchema = z.object({
    passsword:z.string().min(8),
    firstName:z.string().optional(),
    lastName:z.string().optional(),
})

userRouter.put('/',authMiddleware,async (req,res) =>{
    const body = req.body;

    const { success } = updateSchema.safeParse(body);

    if(!success) 
        res.send(411).json({
    message:"error while updating information"
})

try {
    const updatedUser =  await User.updateOne({ id: req.userId }, req.body);
    

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

} catch (error) {
    

    res.status(500).json({ message: "Error updating user", error });
}

})


userRouter.post('/bulk',async(req,res) => {

    const filter = req.query.filter || "";


const users = await userModel.find({
        $or:[{
            firstName:{
                "$regex":filter,
                "$options": "i"
            }
        },{
            lastName:{
                "$regex":filter,
                "$options": "i"
            }
        }]
    })


    if(!users.length)
        return res.status(404).json({message:"user not found"})

    res.json({
        users:users.map(user => {
            username:user.username;
            firstName:user.firstName;
            lastName:user.lastName;
            id:user._id
        })
    })
}
)




module.exports = userRouter;