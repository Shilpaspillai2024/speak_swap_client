import Link from 'next/link';
import { FaUsers, FaChalkboardTeacher, FaComments,FaUser, FaCreditCard } from 'react-icons/fa';

const TutorSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#C9E4CA] text-[#3B6064] p-6">
      <div className="space-y-6">
        <Link href="/tutor/dashboard" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaUsers size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/tutor/myschedule" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaChalkboardTeacher size={20} />
          <span>MySchedule</span>
        </Link>
        <Link href="/tutor/chats" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          < FaComments size={20} />
          <span>Messages</span>
        </Link>
        <Link href="/tutor/payments" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaCreditCard size={20} />
          <span>Payments</span>
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
