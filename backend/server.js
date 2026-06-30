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
const message = require("./models/Message");

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

io.on("connection",async(socket)=>{
    console.log("User Connected :"+socket.user.username);
    await User.findByIdAndUpdate(socket.user._id,{isOnline:true})
    io.emit("userOnline",{userId:socket.user._id})
    socket.join(`user_${socket.user._id}`)

    socket.on("disconnect",async()=>{
        await User.findByIdAndUpdate(socket.user._id,{isOnline:false,lastSeen:new Date()})
        io.emit("userOffline",{userId:socket.user._id})
        console.log("User disconnected: "+socket.user.username)
    })

    socket.on("joinRoom",(roomId)=>{
        socket.join(roomId)
        socket.to(roomId).emit("userJoined",{
            username: socket.user.username,
            message: socket.user.username+" joined the room"
        })
    })

    socket.on("leaveRoom",(roomId)=>{
        socket.leave(roomId)
        socket.to(roomId).emit("userLeft",{
            username: socket.user.username,
            message: socket.user.username+" left the room"
        })
    })

    socket.on("sendMessage",async({roomId,content})=>{
        try{
        const message = new Message({
            room:roomId,
            sender:socket.user._id,
            content,
            type:"room"
        })
        await message.save();
        await message.populate("sender","username avatar")
        io.to(roomId).emit("newMessage",message)
        }
        catch(err){
            socket.emit("error",{message:err.message})
        }
    })

    socket.on("typing",(roomId)=>{
        socket.to(roomId).emit("typing",{username:socket.user.username})
    })

    socket.on("stopTyping",(roomId)=>{
        socket.to(roomId).emit("stopTyping",{username:socket.user.username})
    })

    socket.on("sendDirect",async({recipientId,content})=>{
        try{
            const message = new Message({
                sender:socket.user._id,
                content,
                type:"direct",
                recipient:recipientId
            })
            await message.save();
            await message.populate("sender","username avatar")
            io.to(`user_${recipientId}`).emit("directMessage",message)
            socket.emit("directMessage",message)
        }
        catch(err){
            socket.emit("error",{message:err.message})
        }
    })

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