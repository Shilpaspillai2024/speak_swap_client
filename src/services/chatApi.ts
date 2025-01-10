import userAxiosInstance from "./userAxiosInstance";
import tutorAxiosInstance from "./tutorAxiosInstance";
import userAuthStore from "@/store/userAuthStore";
import tutorAuthStore from "@/store/tutorAuthStore";
import socketStore from "@/store/socketStore";

export const createChat = async (
  participants: { participantId: string; role: "user" | "tutor" }[],
  role: "user" | "tutor"
) => {
  try {
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;

    const userStore = userAuthStore.getState();

    const tutorStore = tutorAuthStore.getState();

    const senderId =
      role === "user" ? userStore.user?._id : tutorStore.tutor?._id;

    const senderRole = role;

    if (!senderId) {
      throw new Error("Sender not authenticated");
    }

    const recipient = participants.find(
      (participant) => participant.participantId !== senderId
    );

    if (!recipient) {
      throw new Error("Recipient not found");
    }

    
    const response = await instance.post(`/chat`, {
      participants,
      senderId,
      senderRole,
    });

    console.log("createresponse",response);
    return {
      chatId: response.data._id.toString(),
      recipient,
      senderId,
      senderRole,
    };
  } catch (error: any) {
    console.error(
      "Error creating chat:",
      error.response?.data || error.message || error
    );
    throw error.response?.data?.error || "Error creating chat";
  }
};

export const fetchChatList = async (role: "user" | "tutor") => {
  try {
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;
    const userStore = userAuthStore.getState();
    const tutorStore = tutorAuthStore.getState();

    const participantId =
      role === "user" ? userStore.user?._id : tutorStore.tutor?._id;


      console.log("participantid",participantId)
    if (!participantId) {
      throw new Error("User not authenticated");
    }

    const response = await instance.get(`/chat/participant/${participantId}`);
    console.log("fetchChatlist response:",response)
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error in fetching chats";
  }
};

export const getChatById = async (chatId: string, role: "user" | "tutor") => {
  try {
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;
    const response = await instance.get(`/chat/${chatId}`);
    console.log("response of get chatByid",response)
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error fetching chat";
  }
};

export const sendMessage = async (
  data: {
    chatId: string;
    message: string;
    
  },
  role: "user" | "tutor"
) => {
  try {
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;
    const userStore = userAuthStore.getState();
    const tutorStore = tutorAuthStore.getState();

    const senderId =
      role === "user" ? userStore.user?._id : tutorStore.tutor?._id;
    console.log("senderId from sendmessage", senderId);
    const senderRole = role;

    if (!senderId) {
      throw new Error("Sender not authenticated");
    }

    const response = await instance.post(`/message/send`, {
      ...data,
      senderId,
      senderRole,
      
    });
   

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error sending message";
  }
};

export const fetchMessages = async (chatId: string, role: "user" | "tutor") => {
  try {
    console.log("calling fecth mesage from chat api");
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;
    const response = await instance.get(`/message/${chatId}`);
    console.log("response of fecthmessages",response);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error in fetching messages";
  }
};

export const markMessageAsRead = async (
  chatId: string,
  role: "user" | "tutor"
) => {
  try {
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;
    const userStore = userAuthStore.getState();
    const tutorStore = tutorAuthStore.getState();

    const userId =
      role === "user" ? userStore.user?._id : tutorStore.tutor?._id;

    const response = await instance.put(`/message/markAsRead`, {
      chatId,
      userId,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error marking messages as read";
  }
};

export const updateLastMessage = async (
  chatId: string,
  lastMessage: string,
  role: "user" | "tutor",
  timestamp:string,
  userId:string,
  unreadCount:number,
) => {
  try {
    const instance = role === "user" ? userAxiosInstance : tutorAxiosInstance;
    const response = await instance.put("/chat/updateLastMessage", {
      chatId,
      message:lastMessage,
      timestamp,
      userId,
      unreadCount,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error updating last message";
  }
};


export const getChatUsers=async(chatId:string,role:"user" | "tutor")=>{
  try {
    const instance=role==="user" ? userAxiosInstance:tutorAxiosInstance;
    const response=await instance.get(`/chat/${chatId}`)

    console.log("response get users",response)
    return response.data.participants;
    
  } catch (error) {
    throw new Error("Failed to fetch chat users");
  }

}