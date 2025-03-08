import React, { useState } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaHome,
  FaChevronDown,
} from "react-icons/fa";

const Sidebar = () => {
  const [tutorSubmenu, setTutorSubmenu] = useState(false);

  const sidebarLinks = [
    {
      icon: <FaHome size={20} />,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      icon: <FaUsers size={20} />,
      label: "Users",
      href: "/admin/users",
    },
    {
      icon: <FaChalkboardTeacher size={20} />,
      label: "Tutors",
      submenu: [
        {
          label: "All Tutors",
          href: "/admin/tutors",
        },
        {
          label: "Tutor Applications",
          href: "/admin/tutors/tutorapplications",
        },
      ],
    },
    {
      icon: <FaClipboardList size={20} />,
      label: "Bookings",
      href: "/admin/bookings",
    },
  ];

  return (
    <aside className="h-auto min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white p-6 shadow-2xl flex flex-col">
      <div className="space-y-4">
        {sidebarLinks.map((link, index) => (
          <div key={index}>
            {link.submenu ? (
              <div>
                <div
                  className="flex items-center justify-between text-lg cursor-pointer hover:text-blue-300 transition"
                  onClick={() => setTutorSubmenu(!tutorSubmenu)}
                >
                  <div className="flex items-center space-x-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  <FaChevronDown
                    size={16}
                    className={`transition-transform ${
                      tutorSubmenu ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {tutorSubmenu && (
                  <div className="ml-6 mt-2 space-y-2">
                    {link.submenu.map((sublink, subindex) => (
                      <Link
                        key={subindex}
                        href={sublink.href}
                        className="block text-sm hover:text-blue-300 transition"
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={link.href}
                className="flex items-center space-x-2 text-lg hover:text-blue-300 transition"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
