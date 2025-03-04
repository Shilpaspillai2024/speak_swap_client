"use client";

import React, { useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { ITutor } from "@/types/tutor";
import { useState } from "react";
import { getPendingTutors} from "@/services/adminApi";
import protectedRoute from "@/HOC/AdminProtectedRoute";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

const PendingTutor = () => {
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await getPendingTutors(currentPage, itemsPerPage);
        console.log("fetched tutors:", response);

        setTutors(response.tutors);
        setTotalItems(response.meta.totalItems);
        setTotalPages(response.meta.totalPages);
        setCurrentPage(response.meta.currentPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending tutors:", error);
        setLoading(false);
      }
    };

    fetchTutors();
  }, [currentPage]);

  const handleViewDetails = (tutorId: string) => {
    router.push(`/admin/tutors/tutorapplications/${tutorId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col">
      <AdminNavbar />

      <div className="flex">
        <Sidebar />

        <div className="container mx-auto p-4 bg-[#f5f5f5]">
          <h1 className="text-2xl font-bold mb-4">
            Pending Tutor Applications
          </h1>

          {loading ? (
            <p className="text-center">Loading tutors...</p>
          ) : (
            <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-sm text-white">
              <thead>
                <tr className="bg-[#4d4d6d]">
                  <th className="py-2 px-4 text-left">Si.no</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Country</th>
                  <th className="py-2 px-4 text-left">Teaching Language</th>
                  <th className="py-2 px-4 text-left">Video</th>
                  <th className="py-2 px-4 text-left">Documents</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {tutors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-2">
                      No pending tutors
                    </td>
                  </tr>
                ) : (
                  tutors.map((tutor, index) => (
                    <tr key={tutor._id} className="border-b">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{tutor.email}</td>
                      <td className="py-2 px-4">{tutor.name}</td>
                      <td className="py-2 px-4">{tutor.country}</td>
                      <td className="py-2 px-4">{tutor.teachLanguage}</td>
                      <td className="py-2 px-4">
                        <a
                          href={tutor.introductionVideo}
                          target="_blank"
                          className="text-blue-500"
                        >
                          Watch video
                        </a>
                      </td>
                      <td className="py-2 px-4">
                        {tutor.certificates.length > 0 ? (
                          tutor.certificates.map((certificate, index) => (
                            <a
                              key={index}
                              href={certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 block mb-1"
                            >
                              View Certificate {index + 1}
                            </a>
                          ))
                        ) : (
                          <span>No documents available</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-white ${
                            tutor.status === "approved"
                              ? "bg-green-500"
                              : tutor.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {tutor.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleViewDetails(tutor._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default protectedRoute(PendingTutor);
