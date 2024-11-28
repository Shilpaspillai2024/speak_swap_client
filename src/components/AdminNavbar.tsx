import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useAdminAuthStore from '@/store/adminAuthStore';

const AdminNavbar = () => {

  const clearAdminAuth = useAdminAuthStore((state) => state.adminLogout);

  const [menuOpen,setMenuOpen]=useState(false)

  const router=useRouter()

  const handleLogout=()=>{
    clearAdminAuth();
    router.push('/admin')

  }
  return (
    <div className="w-full bg-[#22223B] text-white p-2 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">SpeakSwap</div>

      <div className='relative'>

        <div className=' flex flex-col items-center cursor-pointer' onClick={()=>setMenuOpen((prev)=>!prev)}>

       
    
        <FaUserCircle size={38} />
        <span className="mt-2 text-sm">Admin</span>
      </div>

        {/* Logout Menu */}
        {menuOpen && (
          <div className="absolute top-14 right-0 bg-white text-black rounded shadow-lg">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm w-full hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
        </div>
    </div>
  );
};

export default AdminNavbar;
