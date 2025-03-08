"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  XCircle,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import TutorNavbar from "@/components/TutorNavbar";
import { tutorBooking } from "@/types/booking";
import {
  cancelSession,
  getTutorBookings,
  startSession,
} from "@/services/tutorApi";
import TutorSidebar from "@/components/TutorSidebar";
import TutorProtectedRoute from "@/HOC/TutorProtectedRoute";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import tutorAuthStore from "@/store/tutorAuthStore";

const TutorBookings = () => {
  const [bookings, setBookings] = useState<tutorBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setBookingDetails } = useBookingStore();


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const {token}=tutorAuthStore.getState();

  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

  const router = useRouter();

  useEffect(() => {
    fetchTutorBookings();
  }, [currentPage]);

  const fetchTutorBookings = async () => {
    try {
      setIsLoading(true);
      const response = await getTutorBookings(currentPage, itemsPerPage);
      console.log("response from backend ", response);
      setBookings(response.bookings);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.currentPage);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const initialTimeLeft: { [key: string]: number } = {};
    bookings.forEach((booking) => {
      const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(" ");
        const [h, m] = time.split(":").map(Number);
        let hours = h; 
        const minutes = m;
        // let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return { hours, minutes };
      };

      const { hours, minutes } = parseTime(booking.selectedSlot.startTime);
      const sessionStart = new Date(booking.selectedDate);
      sessionStart.setHours(hours, minutes, 0, 0);

      const activationTime = new Date(sessionStart.getTime() - 10 * 60 * 1000);
      const currentTime = new Date();

      if (currentTime < activationTime) {
        initialTimeLeft[booking._id] =
          activationTime.getTime() - currentTime.getTime();
      } else {
        initialTimeLeft[booking._id] = 0;
      }
    });
    setTimeLeft(initialTimeLeft);
  }, [bookings]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    bookings.forEach((booking) => {
      const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(" ");

        const [h, m] = time.split(":").map(Number);
        let hours = h; 
        const minutes = m;

        // let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return { hours, minutes };
      };

      const { hours, minutes } = parseTime(booking.selectedSlot.startTime);
      const sessionStart = new Date(booking.selectedDate);
      sessionStart.setHours(hours, minutes, 0, 0);

      // Setting activation time to 10 minutes before session start
      const activationTime = new Date(sessionStart.getTime() - 10 * 60 * 1000);
      const currentTime = new Date();

      if (currentTime >= activationTime) {
        setActiveBookingId(booking._id);
      } else if (currentTime < activationTime) {
        const timeUntilActivation =
          activationTime.getTime() - currentTime.getTime();
        const timer = setTimeout(() => {
          setActiveBookingId(booking._id);
        }, timeUntilActivation);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [bookings]);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        color: "bg-amber-50 text-amber-700 border border-amber-200",
        icon: <AlertCircle className="w-4 h-4" />,
      },
      confirmed: {
        color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      completed: {
        color: "bg-blue-50 text-blue-700 border border-blue-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        color: "bg-rose-50 text-rose-700 border border-rose-200",
        icon: <XCircle className="w-4 h-4" />,
      },
    };

    return badges[status as keyof typeof badges] || badges.pending;
  };

  useEffect(() => {
    if (bookings.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft: { [key: string]: number } = { ...prevTimeLeft };

        bookings.forEach((booking) => {
          const parseTime = (timeStr: string) => {
            const [time, modifier] = timeStr.split(" ");
            // const [hours, minutes] = time.split(":").map(Number);

            const [h, m] = time.split(":").map(Number);
            let hours = h; 
            const minutes = m;

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return { hours, minutes };
          };

          const { hours, minutes } = parseTime(booking.selectedSlot.startTime);
          const sessionStart = new Date(booking.selectedDate);
          sessionStart.setHours(hours, minutes, 0, 0);

          const activationTime = new Date(
            sessionStart.getTime() - 10 * 60 * 1000
          );
          const currentTime = new Date();

          if (currentTime < activationTime) {
            newTimeLeft[booking._id] =
              activationTime.getTime() - currentTime.getTime();
          } else {
            newTimeLeft[booking._id] = 0;
          }
        });

        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bookings]);

  const formatTimeLeft = (milliseconds: number) => {
    if (milliseconds <= 0) return "0m 0s";

    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleJoinSession = async (booking: tutorBooking) => {

   
    setBookingDetails({
      bookingId: booking._id,
      userId: booking.userId._id,
      tutorId: booking.tutorId._id,
      selectedDate: booking.selectedDate,
      selectedSlot: booking.selectedSlot,
      userRole: "tutor",
    });

    const result = await startSession(booking._id);
    // console.log("session started",result)
    // router.push(`/classRoom/${booking._id}`)
    if (result) {
      router.push(`/classRoom/${booking._id}`);
    } else {
      toast.error("Failed to start the session. Please try again.");
    }
  };

  const handleCancelSession = async (bookingId: string) => {
    console.log("bookingId", bookingId);
    try {
      const response = await cancelSession(bookingId);
      console.log("Cancellation response:", response);
      toast.success(response.message);
      fetchTutorBookings();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel session";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex">
        <TutorSidebar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schedules</h1>
              <p className="mt-2 text-gray-600">
                Manage your teaching sessions and student bookings
              </p>
            </div>
            <div className="flex space-x-2">
              {["confirmed", "pending", "completed", "cancelled"].map(
                (status) => (
                  <div
                    key={status}
                    className={`${
                      getStatusBadge(status).color
                    } px-3 py-1 rounded-full text-sm flex items-center`}
                  >
                    {getStatusBadge(status).icon}
                    <span className="ml-1.5 font-medium capitalize">
                      {status}
                    </span>
                  </div>
                )
              )}
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
                        {booking.userId.profilePhoto ? (
                          <Image
                            src={booking.userId.profilePhoto}
                            alt={booking.userId.fullName}
                            width={56}
                            height={56}
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {booking.userId.fullName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.userId.fullName}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-gray-500">
                            <Mail className="w-4 h-4 mr-2" />
                            {booking.userId.email}
                          </div>
                          {booking.userId.phone && (
                            <div className="flex items-center text-gray-500">
                              <Phone className="w-4 h-4 mr-2" />
                              {booking.userId.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center px-4 py-1.5 rounded-full ${
                        getStatusBadge(booking.status).color
                      }`}
                    >
                      {getStatusBadge(booking.status).icon}
                      <span className="ml-2 text-sm font-semibold capitalize">
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">
                        {formatDate(booking.selectedDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">
                        {booking.selectedSlot.startTime} -{" "}
                        {booking.selectedSlot.endTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">${booking.sessionFee}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    {(booking.status === "confirmed" ||
                      booking.status === "in-progress") && (
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleJoinSession(booking)}
                          disabled={activeBookingId !== booking._id}
                          className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow ${
                            activeBookingId === booking._id
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-400 text-gray-700 cursor-not-allowed"
                          }`}
                        >
                          <Video className="w-5 h-5 mr-2" />
                          Start Session
                        </button>
                        <button
                          onClick={() => handleCancelSession(booking._id)}
                          className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm hover:shadow"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Cancel Session
                        </button>
                        {timeLeft[booking._id] > 0 && (
                          <div className="flex items-center text-red-600 font-semibold bg-gray-100 p-2 rounded-lg shadow-md w-fit">
                            <Clock className="w-5 h-5 text-red-500 animate-pulse mr-2" />
                            <span>
                              Time left:{" "}
                              {formatTimeLeft(timeLeft[booking._id] || 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  No bookings yet
                </h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                  {`You don't have any student bookings yet. When students book sessions with you, they'll appear here.`}
                </p>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProtectedRoute(TutorBookings);
