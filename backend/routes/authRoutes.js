const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register",async(req,res)=>{
    try{
        const {username,name,email,password,avatar} = req.body;
        const usernameCheck = await User.findOne({username});
        const emailCheck = await User.findOne({email});
        if(usernameCheck)
            return res.status(400).json({message:"username taken"});
        if(emailCheck)
            return res.status(400).json({message:"Email already registered"})
        const user = new User({username,name,email,password,avatar:avatar||undefined})
        await user.save();
        res.status(201).json({message:"Registered Successfully"});
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
    const userExist = await User.findOne({email});
    if(!userExist)
        return res.status(400).json({message:"Email doesn't exists"});
    const verifyPassword = await bcrypt.compare(password,userExist.password);
    if(!verifyPassword)
        return res.status(401).json({message:"Enter Correct Password"})
    const token = jwt.sign({id:userExist._id,email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
    res.status(200).json({token,name:userExist.name,username:userExist.username,avatar:userExist.avatar});
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})

router.get("/users",authMiddleware,async(req,res)=>{
    try{
        const users = await User.find({_id:{$ne:req.user.id}}).select("-password")///ne not equall
        if(users.length===0)
            return res.status(404).json({message:"No user Found"})
        return res.status(200).json(users);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})


module.exports = router;