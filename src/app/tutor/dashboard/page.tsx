'use client'
import React, { useEffect, useState } from "react";
import TutorProtectedRoute from "@/HOC/TutorProtectedRoute";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";
import Loading from "@/components/Loading";
import tutorAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";

const TutorDashboard = () => {

    const {isLoading,isTutorAuthenticated}=tutorAuthStore();
    const router=useRouter()


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
                        <h1 className="text-2xl font-semibold">Welcome to Tutor Dashboard!</h1>
                     
                    </div>
                </div>
            </div>
        );
    
    
    }

   
   


export default TutorProtectedRoute(TutorDashboard);
