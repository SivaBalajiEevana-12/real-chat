// import {create} from 'zustand';
import { create } from 'zustand'
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios'
import AuthStore from './AuthStore';
// import { subscribe } from '../../backend/src/routes/auth';
const useChatStore=create((set, get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    getUsers: async ()=>{
        set({isUserLoading:true});
        try{
            const res=await axiosInstance.get('/messages/users')
            set({users:res.data})
            toast.success("Users loaded successfully")
            console.log(res);
        }
        catch(e){
            console.log('error in loading users',e);
            toast.error(e.response.data.message)
        }
        finally{
            set({isUserLoading:false})
        }

    },
    getMessages: async (userId)=>{
        set({isMessageLoading:true});
        try{
            const res=await axiosInstance.get(`/messages/${userId}`,)
            set({messages:res.data})
            toast.success("")
        }
        catch(e){
            console.log('error in loading users',e);
            toast.error(e.response.data.message)
        }
        finally{
            set({isMessageLoading:false})
        }

    },
setSelectedUser:(selectedUser)=>set({selectedUser}),
sendMessage:async (data)=>{
    const {selectedUser,messages}=get();
    if(!selectedUser) return;
    try{
        const socket = AuthStore.getState().socket;//
        const result= await axiosInstance.post(`/messages/send/${selectedUser._id}`,data)
        set({messages:[...messages, result.data]})//
        socket.emit("sendMessage", result.data);//
    }
    catch(e){
        toast.error(e.res.data.message)
    }
},
subscribeToMessage:async()=>{
    const{selectedUser}=get();
    if(!selectedUser) return;
    //if(newMessage.senderId!==selectedUser._Id){return}
    const socket=AuthStore.getState().socket;
    socket.on("newMessage",(newMessage)=>{
        if (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id) {
            set({ messages: [...get().messages, newMessage] });
        }
        // set({messages:[...get().messages,newMessage]})
    })
},
unsubscribeForMessage:()=>{
    const socket=AuthStore.getState().socket;
    socket.off("newMessage")
},
}))
export default useChatStore;