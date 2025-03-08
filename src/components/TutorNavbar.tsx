"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import tutorAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { ITutor } from "@/types/tutor";

const TutorNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tutorData, setTutorData] = useState<ITutor | null>(null);

  useEffect(() => {
    const tutor = tutorAuthStore.getState().tutor;
    setTutorData(tutor);
    setMounted(true);

    const unsubscribe = tutorAuthStore.subscribe((state) => {
      setTutorData(state.tutor);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    const clearTutorAuth = tutorAuthStore.getState().Logout;
    clearTutorAuth();
    router.push("/tutor");
  };

  if (!mounted) {
    return (
      <div className="flex justify-between items-center p-1 bg-teal-600">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white">SpeakSwap</h1>
          </Link>
        </div>
        <div className="flex space-x-6 text-white mr-10 font-bold">
          <div className="relative">
            <div className="flex flex-col items-center">
              <FaUserCircle size={38} />
              <span className="w-16 h-4 bg-teal-500 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-1 bg-teal-600">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-white">SpeakSwap</h1>
        </Link>
      </div>

      <div className="flex space-x-6 text-white mr-10 font-bold">
        <div className="relative">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {tutorData?.profilePhoto ? (
              <div className="relative w-10 h-10">
                <Image
                  src={tutorData.profilePhoto}
                  alt="profile"
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <FaUserCircle size={38} />
            )}
            <span>{tutorData?.name}</span>
          </div>

          {menuOpen && (
            <div className="absolute top-14 right-0 bg-white text-black rounded shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm w-full hover:bg-gray-200 transition-colors"
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
