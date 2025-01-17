"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Send, User } from "lucide-react";
import socketStore, { Message } from "@/store/socketStore";
import { toast } from "react-toastify";
import format from "date-fns/format";
import { getChatById } from "@/services/chatApi";
import userAuthStore from "@/store/userAuthStore";
import ChatList from "../page";

const ChatPage = () => {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
 
  const loggedInUser=userAuthStore.getState().user;
  const loggedInUserId=loggedInUser?._id;
  

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    socket,
    messages,
    sendMessage: sendMessageFn,
    initializeChat,
    currentChatId,
    recipientName,
    recipientProfilePicture,
   
  } = socketStore();

 
 

  useEffect(() => {
    if (chatId && (!currentChatId || currentChatId !== chatId)) {
      initializeChat(chatId as string).catch((error) => {
        toast.error("Failed to initialize chat");
        console.error("Error initializing chat:", error);
      });
    }
  }, [chatId, currentChatId, initializeChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const chat = await getChatById(chatId as string, 'user');
        if (chat) {
          const recipient = chat.participants.find(
            (participant:any) => participant.participantId._id !== loggedInUserId
          );
  
          if (recipient) {
            socketStore.setState({
              recipientName: recipient.participantId.fullName,
              recipientProfilePicture: recipient.participantId.profilePhoto,
              recipientId:recipient.participantId._id,
              recipientRole:recipient.participantId.role,
            });
          }
        }
        console.log("Chat fetched using getChatById:", chat);
      } catch (error) {
        console.error("Error fetching chat details:", error);
        toast.error("Failed to fetch chat details");
      }
    };
  
    fetchChatDetails();
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage: Message) => {
        console.log("New message received:", newMessage);
       
        
        socketStore.getState().fetchMessages(chatId as string);
      };

      socket.on("receiveMessage", handleNewMessage);

      return () => {
        socket.off("receiveMessage", handleNewMessage);
      };
    }
  }, [socket, chatId]);




  const handleSendMessage = async () => {
    if (!message.trim() || !chatId) return;

    try {
      await sendMessageFn(chatId as string, message.trim());
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <>
    

      <ChatList/>
   
            {/* Chat Header */}

            <div className="col-span-8 flex flex-col h-[calc(100vh-120px)]">
            <div className="border-b p-4 bg-white">
            <div className="flex items-center space-x-4">
              {recipientProfilePicture ? (
            <img
              src={recipientProfilePicture}
              alt={recipientName || 'Profile Picture'}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <User className="w-10 h-10 text-gray-600" />
          )}
          
              </div>
              <div>
              <h2 className="font-semibold">{recipientName || 'Unknown'}</h2>
                <p className="text-sm text-gray-500">
                  {socket?.connected ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages Container */}
           
            <div className="flex-1 overflow-y-auto p-4 ">
              <div className="flex flex-col space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${
                      msg.senderId === loggedInUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        msg.senderId === loggedInUserId
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-200"
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                      <span className="text-xs opacity-70">
                        {msg.timestamp
                          ? format(
                              new Date(msg.timestamp),
                              "MM/dd/yyyy hh:mm a"
                            )
                          : "Invalid time"}
                      </span>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t p-4 bg-white">


           
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
       
    </>
  );
};

export default ChatPage;
