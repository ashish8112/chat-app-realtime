const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true,minlength:8},
    avatar:{type:String,default:"https://i.pravatar.cc/100"},
    isOnline:{type:Boolean,default:false},
    lastSeen:{type:Date,default:Date.now},
},{timestamps:true})

const User = mongoose.model("User",userSchema);

module.exports=User;
