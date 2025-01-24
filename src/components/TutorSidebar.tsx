'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FaUsers, FaChalkboardTeacher, FaComments, FaUser, FaCreditCard, FaCalendarAlt, FaClock } from 'react-icons/fa';

const TutorSidebar = () => {
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);

  return (
    <div className="w-64 h-screen bg-[#C9E4CA] text-[#3B6064] p-6">
      <div className="space-y-6">
        <Link href="/tutor/dashboard" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaUsers size={20} />
          <span>Dashboard</span>
        </Link>
        <div className="space-y-2">
          <button
            onClick={() => setShowScheduleOptions(!showScheduleOptions)}
            className="flex items-center space-x-2 text-lg hover:text-indigo-400 focus:outline-none w-full text-left"
          >
            <FaChalkboardTeacher size={20} />
            <span>MySchedule</span>
          </button>
          {showScheduleOptions && (
            <div className="ml-6 space-y-1">
              <Link href="/tutor/schedules/availability" className="flex items-center space-x-2 text-base hover:text-indigo-400">
                <FaClock size={16} />
                <span>Set Availability</span>
              </Link>
              <Link href="/tutor/schedules/myschedules" className="flex items-center space-x-2 text-base hover:text-indigo-400">
                <FaCalendarAlt size={16} />
                <span>View Scheduled Classes</span>
              </Link>
            </div>
          )}
        </div>
        <Link href="/tutor/chats" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaComments size={20} />
          <span>Messages</span>
        </Link>
        <Link href="/tutor/wallet" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaCreditCard size={20} />
          <span>Tutor Wallet</span>
        </Link>
        <Link href="/tutor/profile" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaUser size={20} />
          <span>MyProfile</span>
        </Link>
      </div>
    </div>
  );
};

export default TutorSidebar;
