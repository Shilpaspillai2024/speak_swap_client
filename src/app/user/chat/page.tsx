'use client'
import React, { useEffect, useState,useCallback } from 'react';
import { useRouter } from 'next/navigation';
import socketStore from '@/store/socketStore';
import { User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fetchChatList } from '@/services/chatApi';
import userAuthStore from '@/store/userAuthStore';
import UserProtectedRoute from '@/HOC/UserProtectedRoute';
import { Message } from '@/store/socketStore';
import Image from 'next/image';

interface Participant {
  participantId: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
  };
  role: 'user' | 'tutor';
}

interface LastMessage {
  message: string;
  timestamp: string;
}

interface ChatData {
  _id: string;
  participants: Participant[];
  lastMessage?: LastMessage;
  unreadCount: Array<{
    participantId: string;
    count: number;
  }>;
 
}
const ChatList = () => {
  const router = useRouter();
   
  const loggedInUser=userAuthStore.getState().user;
  const loggedInUserId=loggedInUser?._id;
  
   const [chatList, setChatList] = useState<ChatData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = socketStore.getState().getRole(); 
  const socket=socketStore.getState().socket;

 
  console.log("role is",role)
 const loadChats = useCallback(async () => {
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
  }, [role]); 
  
  useEffect(() => {
    loadChats();
  }, [loadChats]);


  useEffect(() => {
    if (socket) {
      const handleReadStatusUpdate = (data: { chatId: string, readBy: string }) => {
        setChatList(prevChats => {
          return prevChats.map(chat => {
            if (chat._id === data.chatId) {
             
              const updatedUnreadCount = chat.unreadCount.map(count => {
                if (count.participantId === data.readBy) {
                  return { ...count, count: 0 };
                }
                return count;
              });
              return { ...chat, unreadCount: updatedUnreadCount };
            }
            return chat;
          });
        });
      };

      socket.on("messagesRead", handleReadStatusUpdate);

      return () => {
        socket.off("messagesRead", handleReadStatusUpdate);
      };
    }
  }, [socket]);

 


  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage: Message) => {
        setChatList(prevChats => {
          return prevChats.map(chat => {
            if (chat._id === newMessage.chatId) {
              
              const updatedUnreadCount = chat.unreadCount.map(count => {
                if (count.participantId === loggedInUserId && newMessage.senderId !== loggedInUserId) {
                  return { ...count, count: count.count + 1 };
                }
                return count;
              });

              return {
                ...chat,
                lastMessage: {
                  message: newMessage.message,
                  timestamp: newMessage.timestamp
                },
                unreadCount: updatedUnreadCount
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
  }, [socket, loadChats, loggedInUserId]);


 
  
  // const navigateToChat = async (chatId: string) => {
  //   try {
  //     console.log('Clicked chat ID:', chatId);
  //     await socketStore.getState().markAsRead(chatId);
      
     
      
      
  //     await socketStore.getState().initializeChat(chatId);
  //     router.push(`/user/chat/${chatId}`);
  //   } catch (error) {
  //     console.error('Error navigating to chat:', error);
  //   }
  // };


  const navigateToChat = async (chatId: string) => {
    try {
      console.log("Clicked chat ID:", chatId);
  
     
      await socketStore.getState().markAsRead(chatId);
  
      
      await socketStore.getState().initializeChat(chatId);
      router.push(`/user/chat/${chatId}`);
    } catch (error) {
      console.error("Error navigating to chat:", error);
    }
  };
  

  const getParticipantName = (chat:ChatData) => {
    const otherParticipant = chat.participants.find(
      (p:Participant) => p.participantId._id !==loggedInUserId
    );
    return otherParticipant?.participantId.fullName || 'Unknown User';
  };

  const getParticipantImage = (chat:ChatData) => {
    const otherParticipant = chat.participants.find(
      (p:Participant) => p.participantId._id !==loggedInUserId
    );
    return otherParticipant?.participantId.profilePhoto
  };

  const getUnreadCount = (chat: ChatData) => {
    const userUnreadCount = chat.unreadCount.find(
      count => count.participantId === loggedInUserId
    );
    return userUnreadCount?.count || 0;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
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
                chatList.map((chat) => (
                   <div
                    key={chat._id}
                  onClick={() => navigateToChat(chat._id)}
                  className="relative p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                 >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-200 p-3 rounded-full overflow-hidden">
                        {getParticipantImage(chat) ? (
                          
                          <Image
                          src={getParticipantImage(chat)!}
                          alt="Profile"
                          width={24}
                          height={24}
                          unoptimized
                          className="object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-600" />
                        )}

                      </div>
                      {getUnreadCount(chat) > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getUnreadCount(chat)}
                        </div>
                      )}
                      
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

export default UserProtectedRoute(ChatList);

