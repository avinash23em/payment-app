const {JWT_SECRET}=require("./config");
const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,nxt)=>{
    const authheader=req.headers.authorization;
    if(!authheader ||authheader.startsWith("Bearer ")){
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
}
