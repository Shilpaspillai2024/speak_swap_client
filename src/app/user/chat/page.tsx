'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import socketStore from '@/store/socketStore';
import { User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fetchChatList } from '@/services/chatApi';
import userAuthStore from '@/store/userAuthStore';



const ChatList = () => {
  const router = useRouter();
   
  const loggedInUser=userAuthStore.getState().user;
  const loggedInUserId=loggedInUser?._id;
  
   const [chatList, setChatList] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = socketStore.getState().getRole(); 
  const socket=socketStore.getState().socket;
  

  console.log("role is",role)
  

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetchChatList(role);
      setChatList(response);
    } catch (error) {
      console.error('Error loading chats:', error);
      setError('Failed to load chats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage: any) => {
        setChatList(prevChats => {
          return prevChats.map(chat => {
            if (chat._id === newMessage.chatId) {
              return {
                ...chat,
                lastMessage: {
                  message: newMessage.message,
                  timestamp: newMessage.timestamp
                }
              };
            }
            return chat;
          });
        });

       
        loadChats();
      };

      socket.on("receiveMessage", handleNewMessage);
      
      socket.on("messageSent", handleNewMessage);

      return () => {
        socket.off("receiveMessage", handleNewMessage);
        socket.off("messageSent", handleNewMessage);
      };
    }
  }, [socket]);

  const navigateToChat = async (chatId: string) => {
    try {
      console.log('Clicked chat ID:', chatId);
     
      await socketStore.getState().initializeChat(chatId);
      router.push(`/user/chat/${chatId}`);
    } catch (error) {
      console.error('Error navigating to chat:', error);
    }
  };

  const getParticipantName = (chat: any) => {
    const otherParticipant = chat.participants.find(
      (p: any) => p.participantId._id !==loggedInUserId
    );
    return otherParticipant?.participantId.fullName || 'Unknown User';
  };

  const getParticipantImage = (chat: any) => {
    const otherParticipant = chat.participants.find(
      (p: any) => p.participantId._id !==loggedInUserId
    );
    return otherParticipant?.participantId.profilePhoto
  };

  if (isLoading) {
    return (
      <>
      
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </>
    );
  }

  return (
    <>
    
           <div className="col-span-4 border-r flex flex-col h-[calc(100vh-120px)]">
           <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-white">
              <h1 className="text-xl font-semibold">Chats</h1>
            </div>

            <div className="flex-1 overflow-y-auto ">
            
          
              {chatList.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No chats yet</p>
                </div>
              ) : (
                chatList.map((chat,index) => (
                   <div
                    key={chat._id}
                  onClick={() => navigateToChat(chat._id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                 >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-200 p-3 rounded-full overflow-hidden">
                        {getParticipantImage(chat) ? (
                          <img
                            src={getParticipantImage(chat)}
                            alt="Profile"
                            className="w-6 h-6 object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{getParticipantName(chat)}</h3>
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {format(new Date(chat.lastMessage.timestamp), 'MMM d, h:mm a')}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-500 truncate max-w-[70%]">
                            {chat.lastMessage?.message || 'No messages yet'}
                          </p>

                          {/* {chat.unreadCount ? (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {chat.unreadCount}
                            </span>
                          ) : null} */}


                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
         </div>
        </div>
     
    </>
  );
};

export default ChatList;

