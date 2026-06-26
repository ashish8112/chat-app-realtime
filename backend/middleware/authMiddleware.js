const jwt = require("jsonwebtoken");
function authMiddleware(req,res,next){
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if(!token)
            return res.status(401).json({message:"Please Login"})
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message:"Token is invalid or expired"})
    }
}

module.exports = authMiddleware;