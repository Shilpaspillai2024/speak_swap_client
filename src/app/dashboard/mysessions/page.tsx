'use client'

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  DollarSign 
} from 'lucide-react';
import UserNavbar from '@/components/UserNavbar';
import { Booking } from '@/types/booking';
import { userbookingDetails } from '@/services/userApi';


const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);
      const response = await userbookingDetails();
      setBookings(response.result);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: <AlertCircle className="w-4 h-4" /> },
      confirmed: { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: <CheckCircle className="w-4 h-4" /> },
      completed: { color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { color: 'bg-rose-50 text-rose-700 border border-rose-200', icon: <XCircle className="w-4 h-4" /> }
    };

    return badges[status as keyof typeof badges] || badges.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <div className="flex space-x-2">
            {['confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
              <div key={status} className={`${getStatusBadge(status).color} px-3 py-1 rounded-full text-sm flex items-center`}>
                {getStatusBadge(status).icon}
                <span className="ml-1.5 font-medium capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-purple-100">
                      {booking.tutorId.profilePhoto ? (
                        <img 
                          src={booking.tutorId.profilePhoto} 
                          alt={booking.tutorId.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {booking.tutorId.name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Session with {booking.tutorId.name}
                      </h3>
                      <p className="text-gray-500 mt-1">{booking.tutorId.email}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center px-4 py-1.5 rounded-full ${getStatusBadge(booking.status).color}`}>
                    {getStatusBadge(booking.status).icon}
                    <span className="ml-2 text-sm font-semibold capitalize">
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{booking.selectedDay}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">
                      {booking.selectedSlot.startTime} - {booking.selectedSlot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">${booking.sessionFee}</span>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="mt-8">
                    <a
                      href={booking.meetingLink}
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium shadow-sm hover:shadow"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Join Session
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No bookings found</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                You haven't booked any sessions yet. Start your learning journey by booking a session with one of our expert tutors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;