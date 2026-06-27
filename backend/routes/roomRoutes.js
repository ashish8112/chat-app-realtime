const Room = require("../models/Room");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const Message = require("../models/Message")

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

router.get("/:roomId/messages",authMiddleware,async(req,res)=>{
    try{
        const {roomId} = req.params;
        const roomCheck = await Room.findById(roomId);
        if(!roomCheck)
            return res.status(404).json({message:"Room doesn't exist"})
        const messages = (await Message.find({room:roomId,type:"room"})
        .populate("sender","username avatar")
        .sort({createdAt:-1})//descending latest message to previous messsage  
        .limit(50));
        if(messages.length===0)
            return res.status(404).json({message:"No message history"});
        return res.status(200).json(messages.reverse()); // because message is stored new to old so new is last and old is lates in messages object so need to reverse
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})

module.exports  = router;