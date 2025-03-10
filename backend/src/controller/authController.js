const bcrypt=require('bcryptjs');
const User=require('../models/usermodel');
const generateToken=require('../config/generateToken')
const cloudinary=require('../config/claudinary');
// const redis = require('../config/redisClient');

const loginController= async(req,res)=>{
    const {email,password}=req.body;
    try{
        // const cachedUser = await redis.get(email);
        // if (cachedUser) {
        //     console.log('✅ User Data Found in Cache');
        //     const userData = JSON.parse(cachedUser);
        //     generateToken(userData._id, res);
        //     return res.status(200).json(userData);
        // }
        const foundUser = await User.findOne({ email }).lean();
        if(!foundUser){
            return res.status(404).send({message:"user not found"})
            //400 invalid credentials for hacker
        }
        const match= await bcrypt.compare(password,foundUser.password)
        if(!match){
            return res.status(400).json({message:"invalid credentials"})
        }
        generateToken(foundUser._id,res);
        // await redis.set(email, JSON.stringify(foundUser), 'EX', 86400);
        res.status(201).send({
            _id:foundUser._id,
            fullName:foundUser.fullName,
            email:foundUser.email,
            profilePic:foundUser.profilePic,

        });

    }
    catch(e){
        console.log("error n login controller",e.message)
        res.status(500).json({message:"internal server error"});
    }
}
const logoutController=(req,res)=>{
   try{
    res.clearCookie("jwt","",{maxAge:0})
    res.status(201).send({
        message:"logout successfully"
    })
   }
   catch(e){
    console.log("error n login controller",e.message)
    res.status(500).json({message:"internal server error"});
   }
}
const signController= async (req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!fullName  || !email || ! password){
            return res.status(400).json({message:"please enter all the fields"});
        } 
        if(!password.length>6){
            return res.status(400).json({message:"password should be 6 character"});
        }
        const existemail= await User.findOne({email}).exec();
        if(existemail){
            return res.status(400).json({message:"Email already exists"});
        }
        const gensalt= await bcrypt.genSalt(10); 
        const hashPass= await bcrypt.hash(password,gensalt)
        const newuser=new User({
            fullName:fullName,
            email:email,
            password:hashPass
        })
        
        if(newuser){
            const token=generateToken(newuser._id,res)
            const result=await newuser.save();
            res.status(201).send({
                _id:newuser._id,
                fullName:newuser.fullName,
                email:newuser.email,
                profilePic:newuser.profilePic,

            });//
        }
        else{
            return res.status(400).json({message:"user not created"});
        }
        // const result=await newuser.save()
    }
    catch(e){
        console.log("error n signup controller",e.message)
        res.status(500).json({message:"internal server error"});
    }
}
const updateController=async (req,res)=>{
        try{
            const {profilePic}=req.body;
            const userId=req.user._id;
            if(!profilePic){
                return res.status(400).json({message:"profile pic is required"})
            }
            const uploadImage=await cloudinary.uploader.upload(profilePic);
            const updateuser= await User.findByIdAndUpdate(userId,{profilePic:uploadImage.secure_url},{new:true})
            res.status(200).json(updateuser);
        }
        catch(e){
            console.log("error upload controller",e.message)
            res.status(500).json({message:"internal server error"});
        }
        // const { fullName, email, profilePic } = req.body;
        // try {
        //     const user = await User.findById(req.user._id).exec();
        //     if (!user) {
        //         return res.status(404).json({ message: "user not found" });
        //     }
        //     user.fullName = fullName || user.fullName;
        //     user.email = email || user.email;
        //     user.profilePic = profilePic || user.profilePic;
        //     const updatedUser = await user.save();
        //     res.status(200).json(updatedUser);
        // } catch (e) {
        //     console.log("error in update controller", e.message);
        //     res.status(500).json({ message: "internal server error" });
        // }
}
const checkController=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(e){
        console.log("error check controller",e.message)
        res.status(500).json({message:"internal server error"});
    }
}
module.exports={
    loginController,
    logoutController,
    signController,
    updateController,
    checkController
}