"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import AdminNavbar from "@/components/AdminNavbar";
import AdminProtectedRoute from "@/HOC/AdminProtectedRoute";

const AdminDashboard = () => {
  // Dummy data
  const stats = {
    users: 1200,
    tutors: 50,
    bookings: 350,
    payments: "$2,400",
  };

  return (
    <div className="flex flex-col">
      <AdminNavbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col p-8 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-teal-800 p-6 shadow rounded-lg text-center">
              <h2 className="text-lg font-semibold">Users</h2>
              <p className="text-2xl font-bold">{stats.users}</p>
            </div>

            <div className="bg-teal-800 p-6 shadow rounded-lg text-center">
              <h2 className="text-lg font-semibold">Tutors</h2>
              <p className="text-2xl font-bold">{stats.tutors}</p>
            </div>

            <div className="bg-teal-800 p-6 shadow rounded-lg text-center">
              <h2 className="text-lg font-semibold">Bookings</h2>
              <p className="text-2xl font-bold">{stats.bookings}</p>
            </div>

            <div className="bg-teal-800 p-6 shadow rounded-lg text-center">
              <h2 className="text-lg font-semibold">Payments</h2>
              <p className="text-2xl font-bold">{stats.payments}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProtectedRoute(AdminDashboard);
