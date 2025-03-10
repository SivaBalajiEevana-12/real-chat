const  cloudinary  = require('../config/claudinary');
const { getReceiverSocketId,io } = require('../config/socket');
const messagemodel = require('../models/messagemodel');
const User=require('../models/usermodel');
const getUserForSideBar= async(req,res)=>{
    try{
        const loggedUserId=req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedUserId}}).select('-password')
        res.status(200).json(filteredUsers);

    }
    catch(e){
        console.log("error getuser controller",e.message)
        res.status(500).json({message:"internal server error"});
    }
}
const getMessages= async (req,res)=>{
    try{
    const {id:userToChatId}=req.params;
    const senderId=req.user._id;
    const messages= await messagemodel.find({
        $or:[
            {senderId:senderId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:senderId},

        ]
    })
    res.status(200).json(messages);
}
catch(e){
    console.log("error getmesages controller",e.message)
    res.status(500).json({message:"internal server error"});
}
}
const sendMessage=async (req,res)=>{
    try{
        const {text,image}=req.body;
        const{id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage= new messagemodel({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();
        const receiverSocketId=getReceiverSocketId(receiverId);
        
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(200).json({newMessage})
    }
    catch(e){
        console.log("error in send message",e.message)
        res.status(500).json({message:"internal server error"});
    }
}
module.exports={getUserForSideBar,getMessages,sendMessage};