"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBookingDetails } from "@/services/userApi";
import UserNavbar from "@/components/UserNavbar";
import { Check, Calendar, Clock, User, CreditCard } from "lucide-react";

interface BookingDetails {
  day: string;
  startTime: string;
  endTime: string;
  tutorName: string;
  sessionFee: number;
}

const BookingSuccessPage = () => {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const bookingId = new URLSearchParams(window.location.search).get('bookingId');
      if (bookingId) {
        try {
          const data = await getBookingDetails(bookingId);
          const bookingData: BookingDetails = {
            day: data.selectedDay,
            startTime: data.selectedSlot.startTime,
            endTime: data.selectedSlot.endTime,
            tutorName: data.tutorId.name,
            sessionFee: data.sessionFee
          };
          setBookingDetails(bookingData);
          setTimeout(() => setIsVisible(true), 100);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      }
    };

    fetchBookingDetails();
  }, [router]);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div 
          className={`max-w-md w-full bg-white rounded-2xl shadow-xl transform transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {/* Success Icon */}
          <div className="flex justify-center -mt-10">
            <div className="rounded-full bg-green-100 p-4">
              <Check className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Booking Confirmed!
            </h1>

            {/* Booking Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Date</p>
                  <p className="text-gray-800 font-semibold">{bookingDetails.day}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Time</p>
                  <p className="text-gray-800 font-semibold">
                    {bookingDetails.startTime} - {bookingDetails.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Tutor</p>
                  <p className="text-gray-800 font-semibold">{bookingDetails.tutorName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Session Fee</p>
                  <p className="text-gray-800 font-semibold">
                    ${bookingDetails.sessionFee}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium transform transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={() => router.push(`/dashboard`)}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSuccessPage;