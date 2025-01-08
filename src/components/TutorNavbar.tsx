'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import tutorAuthStore from '@/store/tutorAuthStore';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

const TutorNavbar = () => {
  const clearTutorAuth = tutorAuthStore((state) => state.Logout);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tutor = tutorAuthStore.getState().tutor;

  useEffect(() => {
    setMounted(true); 
  }, []);

  const handleLogout = () => {
    clearTutorAuth();
    router.push('/tutor');
  };

  return (
    <div className="flex justify-between items-center p-1 bg-teal-600">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-white">SpeakSwap</h1>
        </Link>
      </div>

      <div className="flex space-x-6 text-white mr-10 font-bold">
        <div className="relative">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setMenuOpen((prev) => !prev)}>
            {mounted && tutor?.profilePhoto ? (
              <Image
                src={tutor.profilePhoto}
                alt="profile"
                width={38}
                height={38}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle size={38} />
            )}
            <span>{tutor?.name}</span>
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

export default TutorNavbar;
