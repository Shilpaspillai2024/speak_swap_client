'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import userAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

const UserNavbar = () => {
  const clearUserAuth = userAuthStore((state) => state.Logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = userAuthStore.getState().user;
  const router = useRouter();

  const handleLogout = () => {
    clearUserAuth();
    router.push('/login');
  };

  return (
    <div className="flex justify-between items-center  bg-customBlue">
     
      <Link href="/">
        <Image
          src="/assets/speaklogo.png"
          alt="speak_swap_logo"
          width={100}
          height={30}
        />
      </Link>

     
      <div className="flex items-center space-x-4 text-customTeal px-1 font-bold">
        <Link href="/community">Community</Link>
        <Link href="/tutor">Tutor</Link>
        <Link href="/mysessions">MySessions</Link>
        <Link href="/messages">Messages</Link>
        <Link href="/profile">Profile</Link>


       
        <div className="relative flex items-center space-x-2">
        
          <div
            className="cursor-pointer flex items-center space-x-2"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle size={38} />
            )}
            {/* <span className="text-white">{user?.fullName}</span> */}
          </div>

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
    </div>
  );
};

export default UserNavbar;
