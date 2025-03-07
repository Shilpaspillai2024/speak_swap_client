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
  RefreshCcw,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { IBooking } from "@/types/booking";
import { userbookingDetails, cancelUserBooking } from "@/services/userApi";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import Pagination from "@/components/Pagination";
import { toast } from "react-toastify";

const UserBookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setBookingDetails } = useBookingStore();
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    fetchUserBookings();
  }, [currentPage]);

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true);
      const response = await userbookingDetails(currentPage, itemsPerPage);
      console.log("bookings", response);
      setBookings(response.result.bookings);
      setTotalItems(response.result.totalItems);
      setTotalPages(Math.ceil(response.result.totalItems / itemsPerPage));
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
      const sessionStart = new Date(
        `${booking.selectedDate}T${booking.selectedSlot.startTime}`
      );
      const activationTime = new Date(sessionStart.getTime() - 5 * 60 * 1000);
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
        // let [hours, minutes] = time.split(":").map(Number);
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

      const activationTime = new Date(sessionStart.getTime() - 5 * 60 * 1000);

      const currentTime = new Date();

      // if (currentTime >= activationTime && currentTime <= sessionStart) {
      if (currentTime >= activationTime) {
        setActiveBookingId(booking._id);
      } else if (currentTime < activationTime) {
        const timeUntilActivation =
          activationTime.getTime() - currentTime.getTime();
        const timer = setTimeout(() => {
          setActiveBookingId(booking._id);
        }, timeUntilActivation);
        timers.push(timer);
      } else {
        setActiveBookingId(null);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [bookings]);

  useEffect(() => {
    if (bookings.length === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft: { [key: string]: number } = { ...prevTimeLeft };

        bookings.forEach((booking) => {
         
          const parseTime = (timeStr: string) => {
            const [time, modifier] = timeStr.split(" ");
            //let [hours, minutes] = time.split(":").map(Number);

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
            sessionStart.getTime() - 5 * 60 * 1000
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

  const handleCancelBooking = async () => {
    if (!cancelBookingId || !cancellationReason.trim()) return;

    try {
      setIsCancelling(true);
      await cancelUserBooking(cancelBookingId, cancellationReason);

      await fetchUserBookings();

      setShowCancelModal(false);

      setCancelBookingId(null);
      toast.success("session cencelled");
    } catch (error:unknown) {

      //console.error("Error cancelling booking:", error);
      const errorMessage =
      error instanceof Error ? error.message : "Failed to cancel booking. Please try again.";
      setCancelError(errorMessage)
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelModal = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setShowCancelModal(true);
    setCancellationReason("");
    setCancelError(null);
  };

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

  const handleJoinSession = (booking: IBooking) => {
    setBookingDetails({
      bookingId: booking._id,
      userId: booking.userId._id,
      tutorId: booking.tutorId._id,
      selectedDate: booking.selectedDate,
      selectedSlot: booking.selectedSlot,
      userRole: "user",
    });
    router.push(`/classRoom/${booking._id}`);
  };

  const handleRetryPayment = (booking: IBooking) => {
    router.push(`/dashboard/tutor/${booking.tutorId._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <div className="flex space-x-2">
            {["confirmed", "payment_failed", "completed", "cancelled"].map(
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
                      {booking.tutorId.profilePhoto ? (
                        <Image
                          src={booking.tutorId.profilePhoto}
                          alt={booking.tutorId.name}
                          width={56}
                          height={56}
                          unoptimized
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
                      <p className="text-gray-500 mt-1">
                        {booking.tutorId.email}
                      </p>
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

                {booking.status === "payment_failed" && (
                  <div className="mt-8">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                      <p className="text-red-700 text-sm">
                        Payment for this session failed. Please retry payment to
                        confirm your booking.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRetryPayment(booking)}
                      className="inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm bg-purple-600 text-white hover:bg-purple-700"
                    >
                      <RefreshCcw className="w-5 h-5 mr-2" />
                      Retry Payment
                    </button>
                  </div>
                )}

                {(booking.status === "confirmed" ||
                  booking.status === "in-progress") && (
                  <div className="mt-8 flex items-center space-x-4">
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
                      Join Session
                    </button>

                    <button
                      onClick={() => openCancelModal(booking._id)}
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm hover:shadow"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel Booking
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
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                No bookings found
              </h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                You haven&apos;t booked any sessions yet. Start your learning
                journey by booking a session with one of our expert tutors.
              </p>
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Booking
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              {cancelError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {cancelError}
                </div>
              )}
            </div>

            {/* Text area for cancellation reason */}
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-red-200"
              placeholder="Enter your cancellation reason..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling || !cancellationReason.trim()} // Prevent empty submission
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors font-medium flex items-center"
              >
                {isCancelling ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProtectedRoute(UserBookings);
