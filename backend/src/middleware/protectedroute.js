const jwt=require('jsonwebtoken')
const User=require('../models/usermodel');
const protecctedRoute= async(req,res,next)=>{
    try{
    const token=req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"unauthorized - no token provided"})
    }
     jwt.verify(token,process.env.JWT_SECRET,async (err,decoded)=>{
        if(err){
            return res.status(401).json({message:"unauthorized - Invalid token"})
        }
        const user=await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "user not found 123" });
        }
        req.user=user;
        next();
     }

     );
    // if(!decoded){
    //     return res.status(401).json({message:"unauthorized - Invalid token"})
    // }
    // const user=await User.findById(decoded.userId).select("-password");
    // if (!user) {
    //     return res.status(404).json({ message: "user not found 123" });
    // }
   
    
    }
    catch(e){
            console.log('error in token verification',e.message);
           return res.status(400).send({message:"error in token verification"})
            
    }
}
module.exports=protecctedRoute;