"use client";

import React from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";


const AdminTutorPage = () => {


  return (

    <div className="flex flex-col">
      <AdminNavbar />

      <div className="flex">
        <Sidebar />
   
   
      <div className="container mx-auto p-4 bg-[#f5f5f5]">
        <h1 className="text-2xl font-bold mb-4">Tutor Management</h1>

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
          
            
          </tbody>
        </table>
      </div>
    
    </div>
    </div>
  );
};

export default AdminTutorPage;