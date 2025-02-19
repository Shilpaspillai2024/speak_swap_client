'use client'

import { useState,useEffect } from "react";
import { Socket } from "socket.io-client";

//import socketStore from "@/store/socketStore";

interface ChatProps {
    socket:Socket;
    bookingId: string;
    userName: string;
  }


const Chat=({socket,bookingId,userName}:ChatProps)=>{
    const [messages,setMessages]=useState<{ senderName: string; message: string }[]>([]);
    
    const [message,setMessage]=useState("");



    useEffect(()=>{
        socket.on("recieveChat",(data)=>{
            setMessages((prev)=>[...prev,data])
        });

        return ()=>{
            socket.off("receiveChat")
        };
    },[socket]);


    const sendMessage=()=>{
        if(!message.trim())return;

        socket.emit("sendChat",{
            bookingId,
            senderName:userName,
            message,
        });

        setMessage("")
    }



    return (

        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="h-60 overflow-y-auto p-2 space-y-2 border-b border-gray-700">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 rounded-lg ${msg.senderName === userName ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>
              <p className="text-sm font-bold">{msg.senderName}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white outline-none"
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    )

}


export default Chat