
import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatListItemProps {
  chatId: string;
  otherUserName: string;
  lastMessage: string;
  timestamp: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chatId, otherUserName, lastMessage, timestamp }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/user/chat/${chatId}`); 
  };

  return (
    <div onClick={handleClick} className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-100">
      <div className="flex-1">
        <h3 className="font-semibold">{otherUserName}</h3>
        <p className="text-sm text-gray-500">{lastMessage}</p>
      </div>
      <span className="text-xs text-gray-400">{timestamp}</span>
    </div>
  );
};

export default ChatListItem;
