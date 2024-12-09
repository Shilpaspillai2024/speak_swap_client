import Link from 'next/link';
import { FaUsers, FaChalkboardTeacher, FaClipboardList, FaCreditCard, FaHeadset,FaHome } from 'react-icons/fa';

const Sidebar = () => {
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
        <Link href="/admin/tutors" className="flex items-center space-x-2 text-lg hover:text-indigo-400">
          <FaChalkboardTeacher size={20} />
          <span>Tutors</span>
        </Link>
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
