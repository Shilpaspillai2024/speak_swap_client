"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, User, Video, Image as ImageIcon } from "lucide-react";
import socketStore, { Message } from "@/store/socketStore";
import { toast } from "react-toastify";
import format from "date-fns/format";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { getChatById } from "@/services/chatApi";
import userAuthStore from "@/store/userAuthStore";
import ChatList from "../page";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import Image from "next/image";

interface Participant {
  participantId: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
    role: "user" | "tutor";
  };
}

const ChatPage = () => {
  const { chatId } = useParams();
  const router = useRouter();
  
  const [message, setMessage] = useState("");
  const [recipientDetails, setRecipientDetails] = useState({
    name: "",
    profilePhoto: "",
    isOnline: false,
    lastActive: "",
  });
  const loggedInUser = userAuthStore.getState().user;
  const loggedInUserId = loggedInUser?._id;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    socket,
    messages,
    sendMessage: sendMessageFn,
    initializeChat,
    currentChatId,
    markAsRead,
  } = socketStore();

 

  useEffect(() => {
    if (chatId && (!currentChatId || currentChatId !== chatId)) {
      const setupChat = async () => {
        try {
          await initializeChat(chatId as string);
          await markAsRead(chatId as string);
        } catch (error) {
          toast.error("Failed to initialize chat");
          console.error("Error initializing chat:", error);
        }
      };
      setupChat();
    }
  }, [chatId, currentChatId, initializeChat, markAsRead]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const chat = await getChatById(chatId as string, "user");
        if (chat) {
          const recipient = chat.participants.find(
            (participant: Participant) =>
              participant.participantId._id !== loggedInUserId
          );

          if (recipient) {
            const recipientData = {
              name: recipient.participantId.fullName,
              profilePhoto: recipient.participantId.profilePhoto || "",
              isOnline: recipient.participantId.isOnline,
              lastActive: recipient.participantId.lastActive || "",
            };

            console.log("recipienData", recipientData);

            setRecipientDetails(recipientData);

            socketStore.setState({
              recipientName: recipient.participantId.fullName,
              recipientProfilePicture: recipient.participantId.profilePhoto,
              recipientId: recipient.participantId._id,
              recipientRole: recipient.participantId.role,
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
  }, [chatId, loggedInUserId]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only images are allowed.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !chatId) return;

    try {
      await sendMessageFn(
        chatId as string,
        message.trim(),
        selectedFile || undefined
      );
      await markAsRead(chatId as string);
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  const startVideoCall = () => {
    if (socket) {
      const videoRoomId = `${chatId}-video`;

      socket.emit("initiateCall", {
        chatId,
        videoRoomId,
        callerName: loggedInUser?.fullName,
      });

      sessionStorage.setItem("isCallInitiator", "true");
      router.push(`/user/video/${videoRoomId}`);
    }
  };

  return (
    <>
      <ChatList />

      {/* Chat Header */}

      <div className="col-span-8 flex flex-col h-[calc(100vh-120px)]">
        <div className="border-b p-4 bg-white">
          <div className="flex items-center justify-between  space-x-4">
            <div className="flex items-center space-x-4">
              {recipientDetails.profilePhoto ? (
                <Image
                  src={recipientDetails.profilePhoto}
                  alt={recipientDetails.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full"
                />
              ) : (
                <User className="w-10 h-10 text-gray-600" />
              )}

              <div>
                <h2 className="font-semibold">{recipientDetails.name}</h2>
                <p className="text-sm text-gray-500">
                  {recipientDetails.isOnline
                    ? "Online"
                    : recipientDetails.lastActive
                    ? `last seen: ${formatDistanceToNow(
                        new Date(recipientDetails.lastActive),
                        { addSuffix: true }
                      )}`
                    : "Offline"}
                </p>
              </div>
            </div>

            {/* Video Call Button */}
            <button
              onClick={startVideoCall}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Video className="w-6 h-6" />
            </button>
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
                  {/* Render text message if exists */}
                  {msg.message && <p className="break-words">{msg.message}</p>}

                  {/* Render image if exists */}
                  {msg.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={msg.imageUrl}
                        alt="Uploaded image"
                        width={200}
                        height={200}
                        className="rounded-lg max-w-full object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  {/* <p className="break-words">{msg.message}</p> */}
                  <span className="text-xs opacity-70">
                    {msg.timestamp
                      ? format(new Date(msg.timestamp), "MM/dd/yyyy hh:mm a")
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
            {/* File input (hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
            />

            {/* Image upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Selected file preview */}
            {selectedFile && (
              <div className="flex items-center mr-2">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected file"
                  width={40}
                  height={40}
                  className="rounded-md object-cover mr-2"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}

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
              disabled={!message.trim() && !selectedFile}
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

export default UserProtectedRoute(ChatPage);
