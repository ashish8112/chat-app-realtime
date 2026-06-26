const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room:{type:mongoose.Schema.Types.ObjectId,ref:"Room"},
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true},
    recipient:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    type:{type:String,enum:["room","direct"],default:"room"},
    readBy:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;