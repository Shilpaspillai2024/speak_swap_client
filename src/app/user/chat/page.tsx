'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import socketStore from '@/store/socketStore';
import UserNavbar from '@/components/UserNavbar';
import { User, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

const ChatList = () => {
  const router = useRouter();
  const { chatList, fetchChatList, senderId } = socketStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("chatList before fecth",socketStore.getState().chatList)

  useEffect(() => {
    const loadChats = async () => {
      try {
        const role = socketStore.getState().getRole(); // Log this
        console.log('Current role:', role);
        setIsLoading(true);
        await fetchChatList();
        console.log("chatList after fetch:", socketStore.getState().chatList);
      } catch (error) {
        console.error('Error loading chats:', error);
        setError('Failed to load chats. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [fetchChatList]);

  const navigateToChat = async (chatId: string) => {
    try {
      await socketStore.getState().initializeChat(chatId);
      router.push(`/user/chat/${chatId}`);
    } catch (error) {
      console.error('Error navigating to chat:', error);
    }
  };

  const getParticipantName = (chat: any) => {
    const otherParticipant = chat.participants.find(
      (p: any) => p._id !== senderId
    );
    return otherParticipant?.name || otherParticipant?.fullName || 'Unknown User';
  };

  const getParticipantImage = (chat: any) => {
    const otherParticipant = chat.participants.find(
      (p: any) => p._id !== senderId 
    );
    return otherParticipant?.profilePicture || otherParticipant?.profilePhoto;
  };

  if (isLoading) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchChatList()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 border-b">
              <h1 className="text-xl font-semibold">Chats</h1>
            </div>
            
            <div className="divide-y">
              {chatList.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No chats yet</p>
                </div>
              ) : (
                chatList.map((chat,index) => (
                   <div
                    key={chat.id}
                  onClick={() => navigateToChat(chat.id)}
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
                          {chat.unreadCount ? (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;

