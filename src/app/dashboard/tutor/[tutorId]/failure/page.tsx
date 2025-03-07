"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, RefreshCcw, Clock, Calendar, User, DollarSign } from 'lucide-react';
import UserNavbar from '@/components/UserNavbar';
import { getBookingDetails } from '@/services/userApi';
import { IBooking } from '@/types/ibooking';
import UserProtectedRoute from '@/HOC/UserProtectedRoute';

const PaymentFailedPage = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tutorId = params.tutorId as string;
  const bookingId = searchParams.get('bookingId');
  const failureReason = searchParams.get('reason') || 'Payment processing failed';

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      try {
        setIsLoading(true);
        const data = await getBookingDetails(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleRetryPayment = () => {
    router.push(`/dashboard/tutor/${tutorId}`);
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <>
        <UserNavbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <UserNavbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Error Card */}
          <div className="bg-white rounded-t-xl shadow-lg p-8 border-b border-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
              <p className="text-gray-600 text-center max-w-md">{failureReason}</p>
            </div>
          </div>

          {/* Booking Details Card */}
          {booking && (
            <div className="bg-white shadow-lg rounded-b-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Tutor</p>
                      <p className="text-gray-900 font-medium">{booking.tutorId?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(booking.selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-gray-900 font-medium">
                        {booking.selectedSlot.startTime} - {booking.selectedSlot.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-gray-900 font-medium">${booking.sessionFee}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Retry Payment
                  </button>
                  <button
                    onClick={handleGoBack}
                    className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProtectedRoute(PaymentFailedPage);