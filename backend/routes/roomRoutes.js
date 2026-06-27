const Room = require("../models/Room");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

router.get("/",async(req,res)=>{
    try{
        const rooms = await Room.find({isPrivate:false});//  means find only those whosse isPrivate field is false
        if(rooms.length===0)
            return  res.status(404).json({message:"No Public Room Available"})
        return res.status(200).json(rooms);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})

router.post("/",authMiddleware,async(req,res)=>{
    try{
        const{name,description,isPrivate} = req.body;
        const nameCheck = await Room.findOne({name})
        if(nameCheck)
            return res.status(403).json({message:"Room name already taken"});
        const room = new Room ({name,description,createdBy:req.user.id,members:[req.user.id],isPrivate})
        await room.save();
        return res.status(201).json(room);
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})

module.exports  = router;