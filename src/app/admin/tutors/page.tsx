"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { getTutors, blockUnblockTutor } from "@/services/adminApi";
import { ITutor } from "@/types/tutor";
import { toast } from "react-toastify";
import protectedRoute from "@/HOC/AdminProtectedRoute";

const AdminTutorPage = () => {
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await getTutors();

        if (Array.isArray(response)) {
          const approvedTutors = response.filter(
            (tutor: ITutor) => tutor.status === "approved"
          );

          setTutors(approvedTutors);
        } else {
          console.error("Invalid response format:", response);
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
        setError("Failed to fetch tutor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const handleBlockUnblock = async (tutorId: string) => {
    try {
      const tutor = tutors.find((t) => t._id === tutorId);
      if (!tutor) throw new Error("Tutor not found.");

      const isActive = !tutor.isActive;
      await blockUnblockTutor(tutorId, isActive);
      setTutors((prevTutors) =>
        prevTutors.map((tutor) =>
          tutor._id === tutorId ? { ...tutor, isActive } : tutor
        )
      );
      toast.success(
        `Tutor ${isActive ? "unblocked" : "blocked"} successfully.`
      );
    } catch (error) {
      console.error("Error in block/unblock:", error);
      toast.error("Failed to update tutor status.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col">
        <AdminNavbar />
        <div className="flex">
          <Sidebar />
          <div className="container mx-auto p-4">
            <p>Loading tutors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <AdminNavbar />
        <div className="flex">
          <Sidebar />
          <div className="container mx-auto p-4">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto p-4 bg-[#f5f5f5]">
          <h1 className="text-2xl font-bold mb-4">Tutor Management</h1>
          {tutors.length === 0 ? (
            <p>No approved tutors found.</p>
          ) : (
            <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-sm text-white">
              <thead>
                <tr className="bg-[#4d4d6d]">
                  <th className="py-2 px-4 text-left">Si.no</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Country</th>
                  <th className="py-2 px-4 text-left">Teaching Language</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {tutors.map((tutor, index) => (
                  <tr key={tutor._id} className="border-t text-black">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{tutor.email}</td>
                    <td className="py-2 px-4">{tutor.name}</td>
                    <td className="py-2 px-4">{tutor.country}</td>
                    <td className="py-2 px-4">{tutor.teachLanguage}</td>
                    <td className="py-2 px-4">{tutor.status}</td>
                    <td className="py-2 px-4">
                      <button
                        className={`py-1 px-3 rounded ${
                          tutor.isActive
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                        onClick={() => handleBlockUnblock(tutor._id)}
                      >
                        {tutor.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default protectedRoute(AdminTutorPage);
