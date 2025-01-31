"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { blockUnblockUser, getAllUser } from "@/services/adminApi";
import { IUser } from "@/types/user";
import { toast } from "react-toastify";
import protectedRoute from "@/HOC/AdminProtectedRoute";


const AdminUserPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUser();
        
        console.log('Fetched Users:', response);
        
        if (Array.isArray(response)) {
          setUsers(response);
        } else {
          console.warn('Fetched users is not an array:', response);
          setError("Invalid user data format");
        }
      } catch (error) {
        console.error('Detailed Error:', error);
        
        if (error instanceof Error) {
          setError(error.message || "Failed to fetch users");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlockUnblock = async(userId: string, currentStatus: boolean) => {
   
    try {
      const updateStatus=!currentStatus;
      const response=await blockUnblockUser(userId,updateStatus)

      setUsers((prevUsers)=>prevUsers.map((user)=>user._id ===userId ?{...user,isActive:updateStatus}:user))
      toast.success(`User ${updateStatus ? "unblocked" : "blocked"} successfully.`);
      console.log(`User ${userId} successfully ${updateStatus ? "unblocked" : "blocked"}`);
    } catch (error) {
      console.error("Error toggling user status:", error);
    setError("Failed to update user status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Si No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Country</th>
                  <th className="px-4 py-3 text-left">Languages</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                   <td className="px-4 py-3">{index+1}</td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.country}</td>
                    <td className="px-4 py-3">
                      <div>Native: {user.nativeLanguage}</div>
                      <div>Learning: {user.learnLanguage} ({user.learnProficiency})</div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.isActive 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleBlockUnblock(user._id, user.isActive)}
                        className={`px-3 py-1 rounded text-white ${
                          user.isActive 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {user.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default protectedRoute(AdminUserPage);