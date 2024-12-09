'use client'
import React from "react";
import TutorProtectedRoute from "@/HOC/TutorProtectedRoute";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";

const TutorDashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <TutorNavbar />

            <div className="flex flex-1">
                <TutorSidebar />

                <div className="flex-1 p-6">
                    <div className="max-h-48 overflow-hidden">
                      
                        <div
                            className="p-4 bg-yellow-100 border-yellow-500 border rounded text-lg animate-marquee"
                        >
                            <p>
                                Welcome to Tutor Dashboard 
                                Your account is currently inactive. It will be reviewed and activated
                                within 48 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorProtectedRoute(TutorDashboard);

