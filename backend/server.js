require("dotenv").config();
const express = require("express");
const {Server} = require("socket.io");
const connectDB = require("./config/db");
const http = require("http");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors())
app.use("/api/auth",authRoutes);

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
