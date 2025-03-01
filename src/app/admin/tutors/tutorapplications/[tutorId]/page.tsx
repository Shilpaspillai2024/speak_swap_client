"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { useParams, useRouter } from "next/navigation";
import { ITutor } from "@/types/tutor";
import { pendingTutorDetails, tutorVerify } from "@/services/adminApi";
import protectedRoute from "@/HOC/AdminProtectedRoute";
import { CheckCircle, XCircle, ArrowLeft, FileText, Video } from "lucide-react";

const TutorDetails = () => {
  const [tutor, setTutor] = useState<ITutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const router = useRouter();
  const tutorId = params.tutorId as string;

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await pendingTutorDetails(tutorId);
        setTutor(response.tutors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tutor details:", error);
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchTutorDetails();
    }
  }, [tutorId]);

  const handleAction = async (action: "approved" | "rejected") => {
    try {
      setProcessing(true);
      await tutorVerify(tutorId, action);
      
      if (tutor) {
        setTutor({ ...tutor, status: action });
      }
      
      setSuccessMessage(
        action === "approved" 
          ? "Tutor application has been approved successfully." 
          : "Tutor application has been rejected."
      );
      
      setTimeout(() => {
        router.push("/admin/tutors/tutorapplications");
      }, 2000);
      
    } catch (error) {
      console.error("Error updating tutor status:", error);
      setProcessing(false);
    }
  };

  const renderLoadingState = () => (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
              <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-36 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotFoundState = () => (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mt-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                <XCircle size={32} />
              </div>
              <h1 className="text-xl font-semibold mb-2">Tutor Not Found</h1>
              <p className="text-gray-600 mb-6">
                The requested tutor application could not be located in our system.
              </p>
              <button
                onClick={() => router.push("/admin/tutors/tutorapplications")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return renderLoadingState();
  if (!tutor) return renderNotFoundState();

  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
              <CheckCircle size={20} className="mr-2" />
              {successMessage}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">Tutor Application Review</h1>
              <button
                onClick={() => router.push("/admin/tutors/tutorapplications")}
                className="inline-flex items-center text-sm px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to List
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Status Badge */}
              <div className="mb-6 flex items-center">
                <span className="text-sm font-medium mr-2">Application Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-medium uppercase tracking-wide ${
                    tutor.status === "approved"
                      ? "bg-green-500"
                      : tutor.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {tutor.status || "Pending Review"}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="lg:col-span-2">
                  <div className="rounded-md border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="text-base font-medium text-gray-800">Personal Information</h2>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-medium">{tutor.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email Address</p>
                          <p className="font-medium">{tutor.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Country of Residence</p>
                          <p className="font-medium">{tutor.country}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Teaching Language</p>
                          <p className="font-medium">{tutor.teachLanguage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Qualifications Summary */}
                <div className="lg:col-span-1">
                  <div className="rounded-md border border-gray-200 h-full">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h2 className="text-base font-medium text-gray-800">Submission Materials</h2>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className={`mt-0.5 mr-3 rounded-full p-1 ${tutor.introductionVideo ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            <Video size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Introduction Video</p>
                            <p className="text-xs text-gray-500">
                              {tutor.introductionVideo ? "Submitted" : "Not submitted"}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className={`mt-0.5 mr-3 rounded-full p-1 ${tutor.certificates && tutor.certificates.length > 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Certification Documents</p>
                            <p className="text-xs text-gray-500">
                              {tutor.certificates && tutor.certificates.length > 0 
                                ? `${tutor.certificates.length} document(s) submitted` 
                                : "No documents submitted"}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Introduction Video */}
              <div className="mt-6">
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-base font-medium text-gray-800">Introduction Video</h2>
                  </div>
                  <div className="p-4">
                    {tutor.introductionVideo ? (
                      <div>
                        <a
                          href={tutor.introductionVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Video size={16} className="mr-2" />
                          View Introduction Video
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No introduction video has been provided by the applicant.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div className="mt-6">
                <div className="rounded-md border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-base font-medium text-gray-800">Certificates & Documents</h2>
                  </div>
                  <div className="p-4">
                    {tutor.certificates && tutor.certificates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tutor.certificates.map((certificate, index) => (
                          <a
                            key={index}
                            href={certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FileText size={16} className="mr-2" />
                            Certificate Document #{index + 1}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No certification documents have been provided by the applicant.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleAction("approved")}
                    disabled={processing || tutor.status === "approved"}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      processing || tutor.status === "approved"
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500"
                    }`}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    {tutor.status === "approved" ? "Application Approved" : processing ? "Processing..." : "Approve Application"}
                  </button>
                  <button
                    onClick={() => handleAction("rejected")}
                    disabled={processing || tutor.status === "rejected"}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      processing || tutor.status === "rejected"
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500"
                    }`}
                  >
                    <XCircle size={16} className="mr-2" />
                    {tutor.status === "rejected" ? "Application Rejected" : processing ? "Processing..." : "Reject Application"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default protectedRoute(TutorDetails);