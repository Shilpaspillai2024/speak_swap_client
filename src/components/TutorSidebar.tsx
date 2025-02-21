'use client';
import { useState, useEffect } from 'react';
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
  const [contentHeight, setContentHeight] = useState('100vh');

  // Monitor main content height to adjust sidebar accordingly
  useEffect(() => {
    const updateHeight = () => {
      const dashboardContent = document.getElementById('dashboard-content');
      if (dashboardContent) {
        const height = Math.max(dashboardContent.scrollHeight, window.innerHeight);
        setContentHeight(`${height}px`);
      }
    };

    // Initial update
    updateHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateHeight);
    
    // Update when content might change
    const observer = new MutationObserver(updateHeight);
    const dashboardContent = document.getElementById('dashboard-content');
    if (dashboardContent) {
      observer.observe(dashboardContent, { 
        childList: true, 
        subtree: true,
        attributes: true 
      });
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      observer.disconnect();
    };
  }, []);

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
      <div 
        className={`
          lg:sticky lg:top-0
          bg-[#C9E4CA] 
          text-[#3B6064] 
          transition-all 
          duration-300 
          ease-in-out
          z-40
          ${isMobileMenuOpen ? 'fixed left-0' : 'fixed -left-full'}
          lg:left-0 lg:relative
          w-64
          overflow-y-auto
          shadow-lg
          lg:shadow-none
          flex-shrink-0
        `}
        style={{ 
          height: isMobileMenuOpen ? '100vh' : contentHeight,
          minHeight: '100vh'
        }}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo or Brand Name */}
          <div className="mb-8 text-xl font-bold text-center lg:text-left">
            Tutor Panel
          </div>

          <div className="flex-grow">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center space-x-2 text-lg hover:text-indigo-400 hover:bg-[#b8deba] p-2 rounded-lg transition-colors duration-200 mb-2"
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
          
          {/* Footer section */}
          <div className="mt-auto pt-4 text-sm text-center text-[#3B6064] opacity-75">
            <p>© {new Date().getFullYear()}</p>
            <p>SpeakSwap</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorSidebar;