const jwt=require('jsonwebtoken')
const generateToken=(userId,res)=>{
    const token=jwt.sign(
            {userId},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie('jwt',token,{httpOnly:true,maxAge:7*24*60*60*1000 ,sameSite:'strict',secure:true})
    return token;
}
module.exports=generateToken;