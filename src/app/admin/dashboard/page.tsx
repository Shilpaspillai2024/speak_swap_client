import React from 'react';

import Sidebar from '@/components/Sidebar';
import AdminNavbar from '@/components/AdminNavbar';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col">
      
      <AdminNavbar />

      <div className="flex">
      
        <Sidebar />

       
        <div className="flex-1 flex flex-col p-8 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="space-y-8">
          
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold">Statistics</h2>
              <p>Add some graphs or stats here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
