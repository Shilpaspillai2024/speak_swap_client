import Link from 'next/link';
import { FaUsers, FaChalkboardTeacher, FaClipboardList, FaCreditCard, FaHeadset,FaHome,FaChevronDown} from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = () => {

  const [tutorSubmenu,setTutorSubmenu]=useState(false)
  return (
    <div className="w-64 h-screen bg-[#4d4d6d] text-white p-6">
      <div className="space-y-6">
      <Link href="/admin/dashboard" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaHome size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/admin/users" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaUsers size={20} />
          <span>Users</span>
        </Link>
           {/* Tutors Section with Submenu */}
           <div>
          <div
            className="flex items-center justify-between text-lg cursor-pointer hover:text-indigo-400"
            onClick={() => setTutorSubmenu(!tutorSubmenu)}
          >
            <div className="flex items-center space-x-2">
              <FaChalkboardTeacher size={20} />
              <span>Tutors</span>
            </div>
            <FaChevronDown size={16} className={`transition-transform ${tutorSubmenu ? 'rotate-180' : ''}`} />
          </div>
          {tutorSubmenu && (
            <div className="ml-6 mt-2 space-y-2">
              <Link href="/admin/tutors" className="block text-sm hover:text-indigo-400">
                All Tutors
              </Link>
              <Link href="/admin/tutors/tutorapplications" className="block text-sm hover:text-indigo-400">
                Tutor Applications
              </Link>
            </div>
          )}
        </div>
        <Link href="/admin/bookings" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaClipboardList size={20} />
          <span>Bookings</span>
        </Link>
        <Link href="/admin/payments" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaCreditCard size={20} />
          <span>Payments</span>
        </Link>
        <Link href="/admin/support" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaHeadset size={20} />
          <span>Support</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
