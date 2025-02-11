"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import userAuthStore from "@/store/userAuthStore";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { IUser } from "@/types/user";


const UserNavbar = () => {
  const clearUserAuth = userAuthStore((state) => state.Logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clientUser, setClientUser] = useState<IUser | null>(null);
  const router = useRouter();
 
  useEffect(() => {
    const user = userAuthStore.getState().user;
    setClientUser(user);
},[]);

  const handleLogout = () => {
    clearUserAuth();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-1 bg-customBlue">
      <Link href="/">
        <Image
          src="/assets/speaklogo.png"
          alt="speak_swap_logo"
          width={70}
          height={50}
        />
      </Link>

      <div className="flex items-center space-x-4 text-customTeal font-bold">
        <Link href="/dashboard">Community</Link>
        <Link href="/dashboard/tutor">Tutor</Link>
        <Link href="/dashboard/mysessions">MySessions</Link>
      

        <div className="relative">
          <Link href="/user/chat">Messages</Link>
         
        </div>

        <Link href="/dashboard/profile">Profile</Link>

        <div className="relative flex items-center space-x-2">
          <div
            className="cursor-pointer flex flex-col items-center"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {clientUser?.profilePhoto ? (
              <Image
                src={clientUser.profilePhoto}
                alt="profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle size={40} />
            )}
            <span className="text-customTeal text-center text-sm">
              {clientUser?.fullName}
            </span>
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
