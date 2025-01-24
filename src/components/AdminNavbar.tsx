import React, { useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useAdminAuthStore from '@/store/adminAuthStore';

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const clearAdminAuth = useAdminAuthStore((state) => state.adminLogout);
  const router = useRouter();

  const handleLogout = () => {
    clearAdminAuth();
    router.push('/admin');
  };

  return (
    <nav className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white p-4 flex justify-between items-center shadow-2xl">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-white tracking-wider">SpeakSwap</div>
      </div>
      
      <div className="relative">
        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition" 
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <FaUserCircle size={40} className="text-blue-300" />
          <span className="mt-1 text-sm text-gray-300">Admin</span>
        </div>
        
        {menuOpen && (
          <div className="absolute top-20 right-0 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-red-50 transition"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;