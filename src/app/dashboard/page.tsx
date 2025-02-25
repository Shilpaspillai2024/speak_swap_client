"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import UserNavbar from "@/components/UserNavbar";
import { fetchUsers } from "@/services/userApi";
import { toast } from "react-toastify";
import userAuthStore from "@/store/userAuthStore";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IUser } from "@/types/user";
import { Search } from "lucide-react";
import Image from "next/image";
import socketStore from "@/store/socketStore";

const UserDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isLoading, isUserAuthenticated, Logout, user } = userAuthStore();
  const socket = socketStore.getState().socket;
  const router = useRouter();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.log("Error during fetching users:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Unauthorized access. Please log in again.");
            Logout();
            router.push("/login");
          } else if (error.response?.status === 403) {
            toast.error("You are not allowed to access this resource.");
          } else {
            toast.error("An unexpected error occurred.");
          }
        } else {
          toast.error("An error occurred while fetching users.");
        }
      }
    };
    loadUsers();

    if (socket && user?._id) {
      socket?.emit("userOnline", user._id);
    }
    if (socket) {
      socket.on("updateUserStatus", ({ userId, isOnline }) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, isOnline } : u))
        );
      });

      return () => {
        socket.off("updateUserStatus");
      };
    }
  }, [Logout, router, socket, user]);

  const filteredUsers = users.filter((user) =>
    user.nativeLanguage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Loading />;
  if (!isUserAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <UserNavbar />

      {/* Search Bar */}

      <div className="flex justify-between items-center mb-4 p-4">
        <div className="relative w-full sm:w-1/3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              placeholder="Search by native language..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Display Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredUsers.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No users found with the selected language.
          </p>
        ) : (
          filteredUsers.map((user, index) => (
            <Link href={`/user/profile/${user._id}`} key={index}>
              <div className="flex bg-white shadow-md rounded-2xl border border-gray-200 p-4">
                <Image
                  src={user.profilePhoto}
                  alt={user.fullName}
                  width={64}
                  height={64}
                  quality={100}
                  unoptimized
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user.fullName}
                    </h2>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          user.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <p className="text-sm text-gray-500">
                        {user.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Country:</strong> {user.country}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Known:</strong> {user.knownLanguages.join(", ")}
                  </p>

                  <div className="flex justify-between mt-2">
                    <p className="text-sm">
                      <strong>Native:</strong> {user.nativeLanguage}
                    </p>
                    <p className="text-sm">
                      <strong>Learning:</strong> {user.learnLanguage}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProtectedRoute(UserDashboard);
