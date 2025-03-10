import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
const app=express()
// const cors=require('cors');
const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        credentials: true,
        allowedHeaders: ["Access-Control-Allow-Origin"],
        methods: ["GET", "POST","PUT"]

    }
})
const userSocketMap={};
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
io.on("connection",(socket)=>{
    console.log("A user is connected",socket.id)
        const userId=socket.handshake.query.userId;
        if(userId) userSocketMap[userId]=socket.id;
        io.emit("getOnlineUsers",Object.keys(userSocketMap))//broadcast all users
        socket.on('sendMessage',message=>{
            const receiverId=getReceiverSocketId(message.receiverId)
            if(receiverId){
                io.to(receiverId).emit('newMessage',data);
            }

        })//socket.emit("sendMessage", result.data);
    socket.on("disconnect",()=>{
        console.log("A user is disconnected",socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})
export{
    io,app,server
}