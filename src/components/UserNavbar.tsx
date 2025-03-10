"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import userAuthStore from "@/store/userAuthStore";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { IUser } from "@/types/user";

const UserNavbar = () => {
  const clearUserAuth = userAuthStore((state) => state.Logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clientUser, setClientUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = userAuthStore.getState().user;
    setClientUser(user);

    const unsubscribe = userAuthStore.subscribe((state) =>
      setClientUser(state.user)
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await clearUserAuth();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest(".user-menu-container")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const navLinks = [
    { href: "/dashboard", label: "Community" },
    { href: "/dashboard/tutor", label: "Tutor" },
    { href: "/dashboard/mysessions", label: "MySessions" },
    {
      href: "/user/chat",
      label: "Messages",
      icon: <FaEnvelope className="inline ml-1" />,
    },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <nav className="flex justify-between items-center p-2 bg-customBlue shadow-md sticky top-0 z-50">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/assets/speaklogo.png"
          alt="speak_swap_logo"
          width={70}
          height={50}
          priority
        />
      </Link>

      {/* Mobile menu button - visible on small screens */}
      <button
        className="md:hidden text-customTeal p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Navigation links - hidden on small screens unless menu is open */}
      <div
        className={`absolute md:static top-14 left-0 right-0 md:flex items-center space-x-6 text-customTeal font-bold bg-customBlue md:bg-transparent p-4 md:p-0 ${
          menuOpen
            ? "flex flex-col space-y-4 md:space-y-0 md:flex-row"
            : "hidden md:flex"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className="hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            {link.label} {link.icon}
          </Link>
        ))}

        <div className="relative user-menu-container">
          <div
            className="cursor-pointer flex items-center space-x-2 hover:text-white transition-colors duration-200"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="flex flex-col items-center">
              {clientUser?.profilePhoto ? (
                <Image
                  src={clientUser.profilePhoto}
                  alt="profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-customTeal"
                />
              ) : (
                <FaUserCircle size={40} />
              )}
              <span className="text-customTeal text-center text-sm font-medium truncate max-w-[80px]">
                {clientUser?.fullName}
              </span>
            </div>
          </div>

          {menuOpen && (
            <div className="absolute top-14 right-0 bg-white text-black rounded shadow-lg w-36 z-50 py-1 overflow-hidden">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm w-full hover:bg-gray-100 text-left text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
