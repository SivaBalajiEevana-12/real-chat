import {create} from "zustand";
// import React from 'react';
import axiosI from '../lib/axios';
import toast from "react-hot-toast";
// import { disconnect } from "mongoose";
import {io} from 'socket.io-client';

const BASEURL="http://localhost:3500"
const AuthStore = create((set,get)=>({
   authUser:null,
   isSigningUP:false,
   isLoggingIn:false,
   isUpdatingProfile:false,
   isCheckingAuth:false,
   onlineUser:[],
   socket:null,
   checkAuth:async()=>{
    set({ isCheckingAuth: true });
    try{
const res=await axiosI.get('/auth/check',{
    headers:{
        'Access-Control-Allow-Credentials':true
    }
});
set({authUser:res.data})
get().connectSocket();
    }
    catch(e){
        set({authUser:null})
        console.log("error is",e)
    }
    finally{
        set({isCheckingAuth:false})
    }

   },
   signup:async(data)=>{
    try{
        set({isSigningUP:true});
        const res=await axiosI.post('/auth/signup',data)
        set({authUser:res.data})
        toast.success("Account created Successfully");
        get().connectSocket();
    }
    catch(e){
        if (e.response && e.response.data && e.response.data.message) {
            toast.error(e.response.data.message);
          } else {
            toast.error('An error occurred during signup');
          }
    }
    finally{
        set({isSigningUP:false})
    }

   },
   logout:async()=>{
    try{
        await axiosI.post('/auth/logout');
        set({authUser:null})
        toast.success("logout successfull")
        get().disconnectSocket();
   }
   catch(e){
    toast.error("error while logout",e);
   }
//    get().disconnectSocket();
//    finally{
//     set({isLoggingIn:false})
//    }
},
login:async(data)=>{
    set({isLoggingIn:true})
    try{
        const res=await axiosI.post('/auth/login',data);
        set({authUser:res.data})
        toast.success("login successful")
        get().connectSocket();
    }
    catch(e){
        toast.error(e.response.data.message); 
    }
    finally{
        set({isLoggingIn:false})
    }
},
updateProfile:async(data)=>
    {
        set({isUpdatingProfile:true})
        try{
            // const res=await axiosI.post('/auth/update-profile',data);
            const res=await axiosI.put('/auth/update-profile',data);
            set({authUser:res.data})
            toast.success("logoin successfull")
        }
        catch(e){
            console.log("error uploading image")
            toast.error(e.response.data.message); 
        }
        finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket:async()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return
        const socket=io(BASEURL,{
            withCredentials: true,
            query:{userId:authUser._id},
            transports: ['websocket', 'polling']
        },
    )
//     withCredentials: true, // ✅ This is important to avoid CORS issues
//   transports: ['websocket', 'polling']
        socket.connect();
        set({socket})
        socket.on("getOnlineUsers",(users)=>{
            set({onlineUser:users})
        })
    },
    disconnectSocket:async()=>{

        if(get().socket?.connected) {
            get().socket.disconnect();
            set({socket:null})
    }}
}))

export default AuthStore
