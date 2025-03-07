'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBookingDetails } from '@/services/adminApi';
import {IBooking} from '@/types/booking'
import AdminNavbar from '@/components/AdminNavbar';
import Sidebar from '@/components/Sidebar';
import AdminProtectedRoute from '@/HOC/AdminProtectedRoute';
import { 
  ClockIcon, 
  CreditCardIcon, 
  UserIcon, 
  MapPinIcon, 
  LanguagesIcon, 
  BookOpenIcon,
  Globe2Icon
} from 'lucide-react';

const DetailSection = ({ 
  title, 
  children, 
  icon: Icon 
}: { 
  title: string, 
  children: React.ReactNode, 
  icon: React.ElementType 
}) => (
  <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-[1.02] hover:shadow-lg">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 mr-3 text-blue-600" />
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="space-y-3 text-gray-700">
      {children}
    </div>
  </div>
);

const StatusBadge = ({ 
  status, 
  type 
}: { 
  status: string, 
  type: 'booking' | 'payment' 
}) => {
  const badgeClasses = {
    booking: {
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    },
    payment: {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
  };

  return (
    <span 
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        badgeClasses[type][status as keyof typeof badgeClasses[typeof type]]
      }`}
    >
      {status}
    </span>
  );
};

const BookingDetailsPage = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingId = params.bookingId as string;
        const response = await getBookingDetails(bookingId);
        setBooking(response.booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params.bookingId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full"></div>
            <p className="text-gray-600 text-xl">Loading booking details...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center">
            <p className="text-red-500 text-2xl mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <Sidebar/>
        <main className="p-6 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-300 to-purple-300 p-6">
                <h1 className="text-3xl font-bold text-white">Booking Details</h1>
              </div>
              
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <DetailSection title="Booking Information" icon={BookOpenIcon}>
                  <p><strong>Booking ID:</strong> {booking._id}</p>
                  <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <div className="flex items-center space-x-2">
                    <strong>Status:</strong> 
                    <StatusBadge status={booking.status} type="booking" />
                  </div>
                  <p><strong>Session Fee:</strong> ${booking.sessionFee}</p>
                  <div className="flex items-center space-x-2">
                    <strong>Payment Status:</strong>
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </div>
                 
                </DetailSection>

                <DetailSection title="Session Details" icon={ClockIcon}>
                  <p><strong>Selected Day:</strong> {booking.selectedDate}</p>
                  <p><strong>Time Slot:</strong> {booking.selectedSlot.startTime} - {booking.selectedSlot.endTime}</p>
                </DetailSection>

                <DetailSection title="User Details" icon={UserIcon}>
                  <p><strong>Name:</strong> {booking.userId.fullName}</p>
                  <p><strong>Email:</strong> {booking.userId.email}</p>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Country:</strong> {booking.userId.country}
                  </div>
                  <div className="flex items-center">
                    <LanguagesIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Known Languages:</strong> {booking.userId.knownLanguages.join(', ')}
                  </div>
                  <div className="flex items-center">
                    <Globe2Icon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Learning Language:</strong> {booking.userId.learnLanguage}
                  </div>
                  <p><strong>Proficiency Level:</strong> {booking.userId.learnProficiency}</p>
                </DetailSection>

                <DetailSection title="Tutor Details" icon={UserIcon}>
                  <p><strong>Name:</strong> {booking.tutorId.name}</p>
                  <p><strong>Email:</strong> {booking.tutorId.email}</p>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Country:</strong> {booking.tutorId.country}
                  </div>
                  <div className="flex items-center">
                    <LanguagesIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Teaching Language:</strong> {booking.tutorId.teachLanguage}
                  </div>
                  <div className="flex items-center">
                    <LanguagesIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Known Languages:</strong> {booking.tutorId.knownLanguages.join(', ')}
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <strong>Time Zone:</strong> {booking.tutorId.timeZone}
                  </div>
                </DetailSection>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProtectedRoute(BookingDetailsPage);