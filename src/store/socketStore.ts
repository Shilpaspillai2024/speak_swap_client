import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import {
  fetchChatList,
  fetchMessages,
  sendMessage,
  markMessageAsRead,
  createChat,
  getChatUsers,
  updateLastMessage,
} from "@/services/chatApi";
import userAuthStore from "./userAuthStore";
import tutorAuthStore from "./tutorAuthStore";

export interface Message {
  id: string;
  message: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
  chatId: string;
  isRead?: boolean;
}

interface Chat {
  id: string;
  participants: Array<{
    id: string;
    role: "user" | "tutor";
    name?: string;
    profilePicture?: string;
  }>;
  lastMessage?: Message;
  unreadCount?: number;
}

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  chatList: Chat[];
  messages: Message[];
  currentChatId: string | null;
  error: string | null;
  recipientId: string | null;
  recipientRole: "user" | "tutor" | null;
  senderId: string | null;
  senderRole: "user" | "tutor" | null;
  recipientName: string | null;
  recipientProfilePicture: string | null;

  connectSocket: () => Promise<void>;
  disconnectSocket: () => void;
  fetchChatList: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, message: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  updateChatList: (message: Message) => void;
  cleanup: () => void;
  getRole: () => "user" | "tutor";
  createChat: (
    participants: { participantId: string; role: "user" | "tutor" }[]
  ) => Promise<string>;

  findExistingChat: (participantId: string) => Chat | undefined;
  joinChat: (chatId: string) => void;
  initializeChat: (chatId: string) => Promise<void>;
}

const socketStore = create<SocketState>()((set, get) => ({
  socket: null,
  isConnected: false,
  chatList: [],
  messages: [],
  currentChatId: null,
  error: null,
  recipientId: null,
  recipientRole: null,
  senderId: null,
  senderRole: null,
  recipientName: null,
  recipientProfilePicture: null,

  connectSocket: async () => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL;
      console.log("attempting to connect to socket", url);
      if (!url) {
        throw new Error("Socket URL is not defined");
      }

      const existingSocket = get().socket;
      if (existingSocket?.connected) {
        console.log("Socket already connected");
        set({ isConnected: true });
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const socket = io(url, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          const currentChatId = get().currentChatId;
          if (currentChatId) {
            socket.emit("joinRoom", currentChatId);
          }
          set({ socket, isConnected: true, error: null });
          resolve();
        });

        socket.on("connect_error", (error) => {
          set({ error: `Connection error: ${error.message}` });
          reject(error);
        });

        socket.on("disconnect", () => {
          set({ isConnected: false });
        });

        socket.on("receiveMessage", (message: Message) => {
          const { currentChatId, messages } = get();
          if (
            currentChatId === message.chatId &&
            !messages.some((msg) => msg.id === message.id)
          ) {
            set({ messages: [...messages, message] });
          }
          get().updateChatList(message);
        });

        set({ socket });
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      throw error;
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  findExistingChat: (participantId: string) => {
    const chatList = get().chatList;
    const currentUserId = get().senderId;
    return chatList.find(
      (chat) =>
        chat.participants.some((p) => p.id === participantId) &&
        chat.participants.some((p) => p.id === currentUserId)
    );
  },

  createChat: async (
    participants: { participantId: string; role: "user" | "tutor" }[]
  ) => {
    try {
      const targetParticipant = participants.find(
        (p) => p.participantId !== get().senderId
      );
      if (!targetParticipant) throw new Error("Invalid participants");
      const existingChat = get().findExistingChat(
        targetParticipant.participantId
      );
      if (existingChat) {
        await get().initializeChat(existingChat.id);
        return existingChat.id;
      }
      const role = get().getRole();
      const { chatId, recipient, senderId, senderRole } = await createChat(
        participants,
        role
      );
      set((state) => ({
        chatList: [
          ...state.chatList,
          {
            id: chatId,
            participants: participants.map((p) => ({
              id: p.participantId,
              role: p.role,
            })),
            lastMessage: undefined,
            unreadCount: 0,
          },
        ],
        currentChatId: chatId,
        recipientId: recipient?.participantId || null,
        recipientRole: recipient?.role || null,
        senderId,
        senderRole,
      }));
      await get().initializeChat(chatId);
      return chatId;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create chat",
      });
      throw error;
    }
  },

  joinChat: (chatId: string) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("joinRoom", chatId);
      console.log("Joined chat room:", chatId);
      //  get().markAsRead(chatId);
    }
  },

  initializeChat: async (chatId: string) => {
    try {
      if (!get().isConnected) {
        await get().connectSocket();
      }
      get().joinChat(chatId);

      const role = get().getRole();
      const chatDetails = await getChatUsers(chatId, role);

      console.log("chatDetails", chatDetails);

      if (!Array.isArray(chatDetails)) {
        console.error("Invalid chatDetails format:", chatDetails);
        throw new Error("chatDetails is not an array");
      }

      const participants = chatDetails.map(
        (detail) => detail.participantId || detail
      );

      console.log("particpinats", participants);

      if (!Array.isArray(participants)) {
        throw new Error("Participants data missing or not in array format");
      }

      const currentUserId = get().recipientId;
      const recipient = participants.find((p) => p._id === currentUserId);

      console.log("recipient", recipient);
      if (recipient) {
        set({
          recipientId: recipient._id,
          recipientRole: recipient.role,
          recipientName: recipient.fullName || "Unknown",
          recipientProfilePicture:
            recipient.profilePhoto || "defaultProfilePic.jpg",
        });
      }

      set((state) => ({
        chatList: state.chatList.map((chat) =>
          chat.id === chatId ? { ...chat, participants } : chat
        ),
      }));

      await get().fetchMessages(chatId);

      // await get().markAsRead(chatId);
    } catch (error) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  },

  fetchChatList: async () => {
    try {
      const role = get().getRole();
      const chats = await fetchChatList(role);

      set({ chatList: chats, error: null });
      console.log("Updated chatList in state:", get().chatList);
      for (const chat of chats) {
        await get().initializeChat(chat.id);
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch chat list",
      });
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      const role = get().getRole();
      console.log("role from store fetch message", role);
      const messages = await fetchMessages(chatId, role);
      set({ currentChatId: chatId, messages, error: null });

      await get().markAsRead(chatId);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
      });
    }
  },

  sendMessage: async (chatId: string, message: string) => {
    try {
      const role = get().getRole();
      const socket = get().socket;
      const senderId = get().senderId;
      const userId=userAuthStore.getState().user._id;

      console.log("userId",userId)


      const timestamp = new Date().toISOString();

      const newMessage = await sendMessage({ chatId, message }, role);

      const currentChat = get().chatList.find(chat => chat.id === chatId);
      const unreadCount = currentChat ? (currentChat.unreadCount || 0) + 1 : 1;


      set((state) => {
        return {
          chatList: state.chatList.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  lastMessage: newMessage,
                  unreadCount,
                }
              : chat
          ),
        };
      });

      if (socket && socket.connected) {
        console.log("Emitting message through socket");
        socket.emit(
          "sendMessage",
          {
            chatId,
            message,
            senderId,
            timestamp,
          },
          (response: any) => {
            console.log("Scoket mesaeg response", response);
          }
        );
      } else {
        console.warn("Socket not connected for real-time message");
      }

      await updateLastMessage(chatId, message, role, timestamp,userId,unreadCount);

      get().updateChatList(newMessage);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to send message",
      });
      throw error;
    }
  },

  markAsRead: async (chatId: string) => {
    try {
      const role = get().getRole();
      await markMessageAsRead(chatId, role);

      set((state) => ({
        chatList: state.chatList.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
        error: null,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark messages as read",
      });
    }
  },

  updateChatList: (message: Message) => {
    set((state) => {
      const chatExists = state.chatList.some(
        (chat) => chat.id === message.chatId
      );
      if (!chatExists) {
        return {
          chatList: [
            ...state.chatList,
            {
              id: message.chatId,
              participants: [],
              lastMessage: message,
              unreadCount: 1,
            },
          ],
        };
      }
      return {
        chatList: state.chatList.map((chat) => {
          if (chat.id === message.chatId) {
            return {
              ...chat,
              lastMessage: message,
              unreadCount: (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        }),
      };
    });
  },

  cleanup: () => {
    get().disconnectSocket();
    set({
      chatList: [],
      messages: [],
      currentChatId: null,
      error: null,
    });
  },

  getRole: () => {
    const userStore = userAuthStore.getState();
    const tutorStore = tutorAuthStore.getState();

    if (userStore.isUserAuthenticated) {
      return "user";
    } else if (tutorStore.isTutorAuthenticated) {
      return "tutor";
    }
    throw new Error("No authenticated user found");
  },
}));

export default socketStore;
