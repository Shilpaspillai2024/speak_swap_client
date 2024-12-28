// "use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'next/navigation';
// import UserNavbar from "@/components/UserNavbar";
// import { useRouter } from "next/navigation";
// import { fetchUserProfile } from "@/services/userApi";
// import { IUser } from "@/Types/user";

// interface Message {
//   id: string;
//   senderId: string;
//   content: string;
//   timestamp: Date;
// }

// const ChatPage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [partner, setPartner] = useState<IUser | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
  
//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     // Load chat partner profile
//     const loadPartnerProfile = async () => {
//       try {
//         const userData = await fetchUserProfile(id as string);
//         setPartner(userData);
//       } catch (error) {
//         console.error("Error fetching partner profile:", error);
//       }
//     };

//     if (id) {
//       loadPartnerProfile();
//     }
//   }, [id]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const message = {
//       id: Date.now().toString(),
//       senderId: 'currentUser', // Replace with actual user ID
//       content: newMessage,
//       timestamp: new Date(),
//     };

//     setMessages([...messages, message]);
//     setNewMessage('');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <UserNavbar />
//       <div className="container mx-auto p-4 max-w-4xl">
//         {/* Chat Header */}
//         <div className="bg-white rounded-t-xl shadow-sm p-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.back()}
//               className="text-gray-600 hover:text-gray-800"
//             >
//               ←
//             </button>
//             {partner && (
//               <>
//                 <img
//                   src={partner.profilePhoto}
//                   alt={partner.fullName}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div>
//                   <h2 className="font-semibold text-lg">{partner.fullName}</h2>
//                   <p className="text-sm text-gray-500">
//                     {partner.nativeLanguage} → {partner.learnLanguage}
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Messages Container */}
//         <div className="bg-white h-[60vh] overflow-y-auto p-4 border-x shadow-sm">
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 <div
//                   className={`max-w-[70%] p-3 rounded-lg ${
//                     message.senderId === 'currentUser'
//                       ? 'bg-blue-500 text-white rounded-br-none'
//                       : 'bg-gray-100 text-gray-800 rounded-bl-none'
//                   }`}
//                 >
//                   <p>{message.content}</p>
//                   <p
//                     className={`text-xs mt-1 ${
//                       message.senderId === 'currentUser'
//                         ? 'text-blue-100'
//                         : 'text-gray-500'
//                     }`}
//                   >
//                     {new Date(message.timestamp).toLocaleTimeString([], {
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Message Input */}
//         <form
//           onSubmit={handleSendMessage}
//           className="bg-white rounded-b-xl shadow-sm p-4 border-x border-b"
//         >
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Send
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

"use client";
import React, { useState, useEffect } from 'react';
import UserNavbar from "@/components/UserNavbar";
import { useRouter } from "next/navigation";
import { IUser } from "@/Types/user";

interface ChatUser {
  id: string;
  name: string;
  photo: string;
  lastMessage: string;
  isOnline: boolean;
  timestamp: string;
}

const ChatInterface = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  // Sample users data
  const [users] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'Matthew Joe',
      photo: '/default-avatar.png',
      lastMessage: 'Hey! I\'m Matthew from France, lets learn...',
      isOnline: true,
      timestamp: '2m'
    },
    // Add more sample users as needed
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Add message sending logic here
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
     <UserNavbar/>

      <div className="container mx-auto mt-4">
        <div className="bg-white rounded-lg shadow-lg flex h-[80vh]">
          {/* Left Side - User List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full p-2 pl-8 border rounded-lg"
                />
                <span className="absolute left-2 top-2.5">🔍</span>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(80vh-73px)]">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b ${
                    selectedUser === user.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{user.name}</h3>
                      <span className="text-xs text-gray-500">{user.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {user.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-blue-100 rounded-lg p-3 max-w-[70%]">
                        <p>Hi Matthew, where are you from ?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                        <p>Hi Kenny! I from Korea and you?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write Something..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      →
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;