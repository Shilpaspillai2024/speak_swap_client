"use client";
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { getBookingDetails } from "@/services/userApi"; 
import UserNavbar from "@/components/UserNavbar";

interface BookingDetails {
  date: string;
  startTime: string;
  endTime: string;
  tutorName: string;
  sessionFee: number;
}

const BookingSuccessPage = () => {
  
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const bookingId = new URLSearchParams(window.location.search).get('bookingId'); 

      console.log("bookingId ",bookingId)
      if (bookingId) {
        try {
          const data = await getBookingDetails(bookingId);

          const bookingData: BookingDetails = {
            date: data.selectedDay, 
            startTime: data.selectedSlot.startTime,
            endTime: data.selectedSlot.endTime, 
            tutorName: data.tutorId.name, 
            sessionFee: data.sessionFee
          };
          setBookingDetails(bookingData);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      }
    };

    fetchBookingDetails();
  }, [router]);

  if (!bookingDetails) {
    return <div>Loading booking details...</div>;
  }

  return (
    <>
    <UserNavbar/>

    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="mb-2">
          <strong>Date:</strong> {bookingDetails.date}
        </p>
        <p className="mb-2">
          <strong>Time:</strong> {bookingDetails.startTime} - {bookingDetails.endTime}
        </p>
        <p className="mb-2">
          <strong>Tutor:</strong> {bookingDetails.tutorName}
        </p>
        <p className="mb-4">
          <strong>Session Fee:</strong> ${bookingDetails.sessionFee}
        </p>
        <button
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
          onClick={() => router.push(`/dashboard`)}
        >
          Back to dashboard
        </button>
      </div>
    </div>
    </>
  );
};

export default BookingSuccessPage;

