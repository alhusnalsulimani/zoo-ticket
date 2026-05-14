import express from "express";
import UserModel from "../models/user.js";
import bcrypt from 'bcrypt'

//API route for user registration (register page)
const router = express.Router();
//API end port
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password, phoneno,role} = req.body;
    const existingUser = await UserModel.findOne({email})
    if(existingUser){
      return res.status(400).json({
        message:"User already exists!"
      })
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const user = new UserModel({
      userName,
      email,
      password:hashedPassword,
      phoneno,
      role
    });

    await user.save();

    res.json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving user",
    });
  }
});

//API route for user login using Node.js + Express + MongoDB
router.post("/login", async(req,res)=>{
  try{
    const{email,password} = req.body
    const user = await UserModel.findOne({email})
    // find user by email
    if(!user)
      return res.status(400).json({message:'user not found'})

    //compare password using hash
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch)
      return res.status(400).json({message:'Password is not correct'})

    // Return user data on success
      res.status(200).json({user: user, message:'Login is successful'})
  }
  catch(error){
    res.status(500).json({message:"server error"})
  }
})


export default router;
