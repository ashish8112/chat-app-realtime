const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    description:{type:String,default:""},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    isPrivate:{type:Boolean,default:false}
},{timestamps:true})

const Room = mongoose.model("Room",roomSchema);

module.exports=Room;