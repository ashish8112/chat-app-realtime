require("dotenv").config();
const express = require("express");
const {Server} = require("socket.io");
const connectDB = require("./config/db");
const http = require("http");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes")
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:"*",methods:["GET","POST"]}})
io.use(async(socket,next)=>{
    const token = socket.handshake.auth.token
    if(!token)
        return next(new Error("Authentication required"))
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        socket.user = await User.findById(decoded.id).select("-password")
        next();
    }
    catch(err){
        next(new Error("Invalid Token"))
    }
})

app.use(express.json());
app.use(cors())
app.use("/api/auth",authRoutes);
app.use("/api/rooms",roomRoutes);

app.use((req,res)=>{
    res.status(404).json({message:"Enter the correct url"})
})

app.use((err,req,res,next)=>{
    console.error(err.message);
    return res.status(500).json({message:err.message})
})



connectDB();

server.listen(process.env.PORT,()=>{
    console.log("Server Started at PORT= "+process.env.PORT);
})
