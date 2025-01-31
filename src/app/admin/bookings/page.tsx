'use client'
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { getAllBookings } from "@/services/adminApi";
import { IBooking } from "@/types/booking";
import { useRouter } from "next/navigation";
import protectedRoute from "@/HOC/AdminProtectedRoute";

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router=useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getAllBookings();
        if (Array.isArray(response.bookings)) {
          setBookings(response.bookings);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);


  const handleViewBooking = (bookingId: string) => {
    router.push(`/admin/bookings/${bookingId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminNavbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full"></div>
              <p className="text-gray-600 text-xl">Loading bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminNavbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-red-500 mx-auto mb-4"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-red-500 text-xl mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Bookings View
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-grow">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-300 to-purple-300 p-6">
              <h1 className="text-3xl font-bold text-white">Booking Management</h1>
            </div>
            
            {bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-24 w-24 mx-auto mb-4 text-gray-300"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-xl">No Bookings found...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      {['Si.no', 'Booking ID', 'Booked User', 'Email', 'Tutor', 'Payment Status', 'Booking Status', 'Session Fee', 'Actions'].map((header) => (
                        <th 
                          key={header} 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr 
                        key={booking._id} 
                        className="hover:bg-gray-50 transition duration-150 border-b"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{booking._id}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{booking.userId.fullName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{booking.userId.email}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{booking.tutorId.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          ${booking.sessionFee}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 transition"
                            onClick={() => handleViewBooking(booking._id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default protectedRoute(AdminBookingPage);