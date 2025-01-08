"use client";
import React, { useEffect, useState } from "react";
import TutorProtectedRoute from "@/HOC/TutorProtectedRoute";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";
import Loading from "@/components/Loading";
import tutorAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";

const TutorDashboard = () => {
  const { isLoading, isTutorAuthenticated } = tutorAuthStore();
  const router = useRouter();

  if (isLoading) return <Loading />;
  if (!isTutorAuthenticated) {
    router.push("/tutor/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TutorNavbar />
      <div className="flex flex-1">
        <TutorSidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold">
            Welcome to Tutor Dashboard!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">Upcoming Classes</h2>
              <p className="text-xl font-semibold">3</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">Total Earnings</h2>
              <p className="text-xl font-semibold">$450</p>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-medium">New Messages</h2>
              <p className="text-xl font-semibold">5</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TutorProtectedRoute(TutorDashboard);
