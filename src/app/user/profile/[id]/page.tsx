"use client";
import React, { useEffect, useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { fetchUserProfile } from "@/services/userApi";
import { toast } from "react-toastify";
import { IUser } from "@/types/user";
import axios from "axios";
import {
  MessageCircle,
  ArrowLeft,
  Globe,
  Book,
  Target,
  Heart,
} from "lucide-react";
import userAuthStore from "@/store/userAuthStore";
import socketStore from "@/store/socketStore";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import Image from "next/image";
const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const loggedInUser = userAuthStore.getState().user;
  const loggedInUserId = loggedInUser?._id;

  useEffect(() => {
    if (!id) return;
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile(id as string);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("User not found.");
        } else {
          toast.error("An error occurred while fetching the profile.");
        }
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [id,router]);

  console.log("outside Invoking createChat with id:", id);

  const handleMessageClick = async () => {
    try {
      const participants = [
        { participantId: loggedInUserId as string, role: "user" as const },
        { participantId: id as string, role: "user" as const },
      ];

      const chatId = await socketStore.getState().createChat(participants);

      if (chatId) {
        router.push(`/user/chat/${chatId}`);
      } else {
        throw new Error("No chat ID returned");
      }
    } catch (error: unknown) {
      console.error("Error creating chat:", error);

      let errorMessage = "Unable to start a chat. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const errResponse = error as {
          response?: { data?: { error?: string }; statusText?: string };
        };
        errorMessage =
          errResponse.response?.data?.error ||
          errResponse.response?.statusText ||
          errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">User not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
         
          <button
            className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-colors"
            onClick={handleMessageClick}
          >
            <MessageCircle className="w-5 h-5" />
            Message
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-300 to-blue-400 p-8 text-white">
            <div className="flex flex-col items-center">
             

              <Image
                src={user.profilePhoto}
                alt={user.fullName}
                width={128} 
                height={128} 
                unoptimized
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <h1 className="text-3xl font-bold mt-4">{user.fullName}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Globe className="w-4 h-4" />
                <span>{user.country}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                  <Book className="w-5 h-5" />
                  Language Profile
                </div>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Native Language:</span>
                    <span className="font-medium">{user.nativeLanguage}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Learning:</span>
                    <span className="font-medium">
                      {user.learnLanguage} ({user.learnProficiency})
                    </span>
                  </p>
                  <p className="flex flex-col gap-1">
                    <span className="text-gray-600">Also Speaks:</span>
                    <span className="font-medium">
                      {user.knownLanguages.join(", ")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                  <Target className="w-5 h-5" />
                 {`Goals & Interests`}
                </div>
                <div className="space-y-2">
                  <p className="flex flex-col gap-1">
                    <span className="text-gray-600">Learning Goal:</span>
                    <span className="font-medium">{user.learningGoal}</span>
                  </p>
                  <p className="flex flex-col gap-1">
                    <span className="text-gray-600">Interests:</span>
                    <span className="font-medium">{user.talkAbout}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                <Heart className="w-5 h-5" />
                {`Why I'm Here`}
              </div>
              <p className="text-gray-700">{user.whyChat}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProtectedRoute(UserProfile);
