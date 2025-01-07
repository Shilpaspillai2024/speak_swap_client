import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical } from "lucide-react";

interface Props {
  participant: {
    fullName: string;
    profilePhoto: string;
    online?: boolean;
  };
}

export default function ChatHeader({ participant }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white border-b p-4 flex items-center gap-4">
      <button 
        onClick={() => router.push("/user/chats")}
        className="hover:bg-gray-100 p-2 rounded-full"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      
      <img
        src={participant.profilePhoto}
        alt={participant.fullName}
        className="w-10 h-10 rounded-full object-cover"
      />
      
      <div className="flex-1">
        <h2 className="font-semibold">{participant.fullName}</h2>
        <p className="text-sm text-gray-500">
          {participant.online ? 'Online' : 'Offline'}
        </p>
      </div>

      <button className="hover:bg-gray-100 p-2 rounded-full">
        <MoreVertical className="w-6 h-6" />
      </button>
    </div>
  );
}