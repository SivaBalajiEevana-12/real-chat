import React, { useEffect, useRef } from 'react'
import useChatStore from '../../store/useChatStore'
import ChatHeader from './skeletons/ChatHeader';
import ChatInput from './skeletons/ChatInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import AuthStore from '../../store/AuthStore';
import { formatMessageTime } from '../../lib/utils/utils1';
// const formatMessageTime = (time) => {
//   const date = new Date(time);
//   return `${date.getHours()}:${date.getMinutes()}`;
// };

const ChatContainer = () => {
  const messageEndRef=useRef();
  const {messages,getMessages,selectedUser,isMessageLoading,subscribeToMessage,unsubscribeForMessage}=useChatStore();
  const {authUser}=AuthStore();
  useEffect(()=>{
    getMessages(selectedUser._id)

    subscribeToMessage();

    return()=>{
      unsubscribeForMessage()
    }
  },[selectedUser._id,getMessages,subscribeToMessage,unsubscribeForMessage])
  useEffect(()=>{
      if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior:"smooth"})
      }
  },[messages])
  if(isMessageLoading) return (<div className='flex-1 flex flex-col overflow-auto'>
    <ChatHeader/>
      <MessageSkeleton/>
      <ChatInput/>
    </div>
    )
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <ChatInput/>
    </div>
  )
}

export default ChatContainer
