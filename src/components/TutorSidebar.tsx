'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaUser, 
  FaCreditCard, 
  FaCalendarAlt, 
  FaClock,
  FaBars,
  FaTimes 
} from 'react-icons/fa';

const TutorSidebar = () => {
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    {
      icon: <FaUsers size={20} />,
      text: 'Dashboard',
      href: '/tutor/dashboard'
    },
    {
      icon: <FaCreditCard size={20} />,
      text: 'Tutor Wallet',
      href: '/tutor/wallet'
    },
    {
      icon: <FaUser size={20} />,
      text: 'MyProfile',
      href: '/tutor/profile'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#C9E4CA] text-[#3B6064] hover:bg-[#a8d4aa] transition-colors duration-200"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static
        h-screen
        bg-[#C9E4CA] 
        text-[#3B6064] 
        p-6
        transition-all 
        duration-300 
        ease-in-out
        z-40
        ${isMobileMenuOpen ? 'left-0' : '-left-full'}
        lg:left-0
        w-64
        overflow-y-auto
        shadow-lg
        lg:shadow-none
      `}>
        <div className="space-y-6">
          {/* Logo or Brand Name could go here */}
          <div className="mb-8 text-xl font-bold text-center lg:text-left">
            Tutor Panel
          </div>

          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center space-x-2 text-lg hover:text-indigo-400 hover:bg-[#b8deba] p-2 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}

          {/* Schedule Section with Dropdown */}
          <div className="space-y-2">
            <button
              onClick={() => setShowScheduleOptions(!showScheduleOptions)}
              className="flex items-center space-x-2 text-lg hover:text-indigo-400 hover:bg-[#b8deba] p-2 rounded-lg transition-colors duration-200 focus:outline-none w-full text-left"
            >
              <FaChalkboardTeacher size={20} />
              <span>MySchedule</span>
            </button>

            <div className={`
              ml-6 
              space-y-1 
              transition-all 
              duration-200 
              ${showScheduleOptions ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
            `}>
              <Link
                href="/tutor/schedules/availability"
                className="flex items-center space-x-2 text-base hover:text-indigo-400 hover:bg-[#b8deba] p-2 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaClock size={16} />
                <span>Set Availability</span>
              </Link>
              <Link
                href="/tutor/schedules/myschedules"
                className="flex items-center space-x-2 text-base hover:text-indigo-400 hover:bg-[#b8deba] p-2 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaCalendarAlt size={16} />
                <span>View Scheduled Classes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorSidebar;