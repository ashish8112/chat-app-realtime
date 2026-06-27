const mongoose = require("mongoose");

async function connect () {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Started "+conn.connection.host);
    }
    catch(err){
        console.error(err.message||"unable to connect Database");
        process.exit(1);
    }
}

module.exports=connect;