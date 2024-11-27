import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const AdminNavbar = () => {
  return (
    <div className="w-full bg-[#22223B] text-white p-2 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">SpeakSwap</div>
      <div className="flex flex-col items-center">
        <FaUserCircle size={38} />
        <span className="mt-2 text-sm">Admin</span>
      </div>
    </div>
  );
};

export default AdminNavbar;
