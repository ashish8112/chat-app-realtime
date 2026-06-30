const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    password:{type:String,required:true,minlength:8},
    avatar:{type:String,default:"https://i.pravatar.cc/100"},
    isOnline:{type:Boolean,default:false},
    lastSeen:{type:Date,default:Date.now},
},{timestamps:true})

userSchema.pre("save",async function (){ // don't use arrow function
    if(!this.isModified("password")) //user.save() time password new hain phir bhi, will marked as modified
        return;
    this.password = await bcrypt.hash(this.password,10);
})

const User = mongoose.model("User",userSchema);

module.exports=User;
//test