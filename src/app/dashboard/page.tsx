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
import { IUser } from "@/Types/user";



const UserDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { isLoading, isUserAuthenticated, Logout } = userAuthStore();
  const router = useRouter();
  

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data=await fetchUsers();
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
  }, []);

  

  if (isLoading) return <Loading />;
  if (!isUserAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <UserNavbar />

      <div className="flex justify-between items-center mb-4 p-4">
        <div className="relative">
          <button
            
            className="bg-[#04BF8A] text-white font-semibold py-2 px-4 rounded-md shadow-sm "
          >
            Filter
          </button>

       </div>
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {users.map((user, index) => (
          <Link href={`/user/profile/${user._id}`} key={index}>
            <div
            className="flex bg-white shadow-md rounded-2xl border border-gray-200 p-4"
          >
            <img
              src={user.profilePhoto}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Country:</strong>
                {user.country}
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
        ))}
      </div>
    </div>
  );
};

export default UserProtectedRoute(UserDashboard);
