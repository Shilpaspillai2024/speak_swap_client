"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import userAuthStore from "@/store/userAuthStore";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { IUser } from "@/types/user";

const UserNavbar = () => {
  const clearUserAuth = userAuthStore((state) => state.Logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clientUser, setClientUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = userAuthStore.getState().user;
    setClientUser(user);
  }, []);

  const handleLogout = async () => {
    await clearUserAuth();
    router.push("/");
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: "/dashboard", label: "Community" },
    { href: "/dashboard/tutor", label: "Tutor" },
    { href: "/dashboard/mysessions", label: "MySessions" },
    { href: "/user/chat", label: "Messages" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <div className="bg-customBlue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/speaklogo.png"
              alt="speak_swap_logo"
              width={70}
              height={50}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-customTeal font-bold">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}

            {/* User Profile */}
            <div className="relative flex items-center">
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
                  <FaUserCircle size={40} className="text-customTeal" />
                )}
                <span className="text-customTeal text-center text-sm">
                  {clientUser?.fullName}
                </span>
              </div>

              {menuOpen && (
                <div className="absolute top-14 right-0 bg-white text-black rounded shadow-lg z-50">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-customTeal hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-customBlue">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-customTeal hover:text-white block px-3 py-2 font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User Profile */}
            <div className="flex items-center px-3 py-2">
              <div className="flex items-center space-x-3">
                {clientUser?.profilePhoto ? (
                  <Image
                    src={clientUser.profilePhoto}
                    alt="profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <FaUserCircle size={40} className="text-customTeal" />
                )}
                <span className="text-customTeal font-bold">
                  {clientUser?.fullName}
                </span>
              </div>
            </div>
            
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left text-customTeal hover:text-white px-3 py-2 font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;