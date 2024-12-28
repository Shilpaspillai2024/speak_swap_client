"use client";
import React, { useState, useEffect } from 'react';
import UserNavbar from "@/components/UserNavbar";
import { useRouter } from "next/navigation";
import { IUser } from "@/Types/user";

interface ChatPreview {
  userId: string;
  user: IUser;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const ChatListPage = () => {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPreview[]>([]);

  useEffect(() => {
    // Fetch user's chat list from your API
    // This is where you'd load the chat previews
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="bg-white rounded-xl shadow-lg">
          {chats.map((chat) => (
            <div
              key={chat.userId}
              onClick={() => router.push(`/user/chat/${chat.userId}`)}
              className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={chat.user.profilePhoto}
                alt={chat.user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{chat.user.fullName}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
          
          {chats.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No messages yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;

