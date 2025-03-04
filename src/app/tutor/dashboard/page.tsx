"use client";
import React, { useEffect, useState } from "react";
import TutorProtectedRoute from "@/HOC/TutorProtectedRoute";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";
import Loading from "@/components/Loading";
import tutorAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";
import { fetchDashboradData, fetchEarnings } from "@/services/tutorApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Transaction {
  date: string;
  amount: number;
  type: "credit" | "debit";
}

const TutorDashboard = () => {
  const { isLoading, isTutorAuthenticated, tutor } = tutorAuthStore();
  const [dashboardData, setDashBoardData] = useState({
    upcomingSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
  });

  const [earnings, setEarnings] = useState<
    { date: string; credit: number; debit: number }[]
  >([]);

  const tutorId = tutor?._id;
  const router = useRouter();

  useEffect(() => {
    if (tutorId) {
      fetchDashboradData(tutorId).then((data) => {
        setDashBoardData({
          upcomingSessions: data.upcomingSessions || 0,
          completedSessions: data.completedSessions || 0,
          cancelledSessions: data.cancelledSessions || 0,
        });
      });

      fetchEarnings(tutorId).then((earningData: Transaction[]) => {
        if (earningData?.length) {
          const formattedEarnings = earningData.reduce(
            (acc: { date: string; credit: number; debit: number }[], txn: Transaction) => {
              const existingEntry = acc.find((entry) => entry.date === txn.date);
              if (existingEntry) {
                if (txn.type === "credit") {
                  existingEntry.credit += txn.amount;
                } else if (txn.type === "debit") {
                  existingEntry.debit += Math.abs(txn.amount);
                }
              } else {
                acc.push({
                  date: txn.date,
                  credit: txn.type === "credit" ? txn.amount : 0,
                  debit: txn.type === "debit" ? Math.abs(txn.amount) : 0,
                });
              }
              return acc;
            },
            []
          );

          setEarnings(formattedEarnings);
        }
      });
    }
  }, [tutorId]);

  if (isLoading) return <Loading />;
  if (!isTutorAuthenticated) {
    router.push("/tutor/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex flex-1">
        <TutorSidebar />
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {tutor?.name || "Tutor"}!
            </h1>
            <p className="text-gray-600 mt-1">
              ${`Here's an overview of your teaching activity`}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Upcoming Sessions</p>
                  <h2 className="text-3xl font-bold text-indigo-600 mt-2">
                    {dashboardData.upcomingSessions}
                  </h2>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 text-sm text-indigo-500">
                {dashboardData.upcomingSessions > 0 ? "Schedule on track" : "No upcoming sessions"}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Sessions</p>
                  <h2 className="text-3xl font-bold text-green-600 mt-2">
                    {dashboardData.completedSessions}
                  </h2>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-500">
                Great job!
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cancelled Sessions</p>
                  <h2 className="text-3xl font-bold text-red-500 mt-2">
                    {dashboardData.cancelledSessions}
                  </h2>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 text-sm text-red-500">
                {dashboardData.cancelledSessions === 0 ? "No cancellations!" : "Review scheduling"}
              </div>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Earnings Overview</h2>
              <div className="flex space-x-2">
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                  Earnings
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                  Refunds
                </span>
              </div>
            </div>
            
            {earnings.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={earnings} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                  />
                  <Legend iconType="circle" />
                  <Line 
                    type="monotone" 
                    dataKey="credit" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    name="Earnings" 
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="debit" 
                    stroke="#FF5733" 
                    strokeWidth={3}
                    name="Refunds" 
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-lg font-medium">No earnings data available yet</p>
                <p className="text-sm mt-1">Completed sessions will appear here</p>
              </div>
            )}
          </div>
          
          {/* Footer section */}
          <div className="text-center text-gray-500 text-sm py-4">
            © {new Date().getFullYear()} SpeakSwap • All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProtectedRoute(TutorDashboard);

