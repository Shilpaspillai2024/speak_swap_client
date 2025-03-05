"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Globe,
  Languages,
  Clock,
  Mail,
  X,
  CheckCircle,
} from "lucide-react";
import UserNavbar from "@/components/UserNavbar";
import { ITutor } from "@/types/tutor";
import {
  tutorProfile,
  createBooking,
  verifyPayment,
  getBookedSlots,
} from "@/services/userApi";
import { toast } from "react-toastify";
import userAuthStore from "@/store/userAuthStore";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import { RazorpayResponse,RazorpayFailureResponse} from "@/types/razorpay";
import Image from "next/image";
import { markPaymentAsFailed } from "@/services/userApi";

const TutorProfilePage = () => {
  const [tutor, setTutor] = React.useState<ITutor | null>(null);
  const [activeTab, setActiveTab] = React.useState("about");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const user = userAuthStore().user;

  console.log("user from store", user);

  const { tutorId } = useParams();

  const router = useRouter();

  React.useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        setIsLoading(true);
        const fetchedTutor = await tutorProfile(tutorId as string);
      
        setTutor(fetchedTutor);
      } catch (error) {
        console.error("Error fetching tutor profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorProfile();
  }, [tutorId]);

  console.log("tutor",tutor)

  const checkSlotAvailability = async (
    date: string,
    slot: { startTime: string; endTime: string }
  ) => {
    try {
      const bookedSlotsData = await getBookedSlots(tutorId as string, date);

      if (bookedSlotsData.success && Array.isArray(bookedSlotsData.data)) {
        const formattedSlots = bookedSlotsData.data.map(
          (booking: { startTime: string; endTime: string }) =>
            `${booking.startTime}-${booking.endTime}`
        );

        console.log("Booked Slots:", formattedSlots);

        const selectedSlotString = `${slot.startTime}-${slot.endTime}`;

        return !formattedSlots.some(
          (bookedSlot: string) => bookedSlot === selectedSlotString
        );
      }

      console.log("No booked slots available for this tutor.");
      return true;
    } catch (error) {
      console.error("Error checking slot availability:", error);
      return false;
    }
  };

  const handleBooking = () => {
    setIsBookingOpen(true);
  };

  const handleSlotSelection = async (
    date: string,
    slot: { startTime: string; endTime: string }
  ) => {
    const isAvailable = await checkSlotAvailability(date, slot);
    console.log("Checked Slot Availability:", date, slot, isAvailable);
    if (!isAvailable) {
      toast.error("This slot is already booked. Please choose another.");
      return;
    }

    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedSlot || !tutor) return;
    try {
      const isAvailable = await checkSlotAvailability(
        selectedDate,
        selectedSlot
      );
      if (!isAvailable) {
        toast.error(
          "This slot was just booked. Please select a different slot."
        );
        setSelectedDate(null);
        setSelectedSlot(null);
        return;
      }

     // const sessionFeeInUSD = tutor.hourlyRate;
     const sessionFee=tutor.hourlyRate

      const bookingData = await createBooking(
        tutorId as string,
        selectedDate,
        selectedSlot,
        sessionFee
      );

      console.log("bookingData", bookingData);
      setIsBookingOpen(false);
      setSelectedDate(null);
      setSelectedSlot(null);
      const bookingId = bookingData.data.savedBooking._id;

      const creditedByString = user?.fullName ?? "Unknown User";
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: sessionFee * 100, // Amount in cents for USD
        currency: "INR", //USD
        order_id: bookingData.data.orderId,
        name: `Seesion with ${tutor.name}`,
        description: `Session Fee: ₹${bookingData.sessionFee}`,
        handler: function (response: RazorpayResponse) {
          console.log("Razorpay Response:", response);

          verifyPayment(
            {
              ...response,
              tutorId: tutorId as string,
              amount: sessionFee,
              creditedBy: creditedByString,
            },
            bookingId
          )
            .then((result) => {
              if(result.success){
                router.push(
                  `/dashboard/tutor/${tutorId}/sucess?bookingId=${bookingId}`
                );

              }else{
                router.push(
                  `/dashboard/tutor/${tutorId}/failure?bookingId=${bookingId}&reason=${encodeURIComponent(result.message)}`
                
                );
              }
            })
            .catch((error) => {
             
              const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
              router.push(
                `/dashboard/tutor/${tutorId}/failure?bookingId=${bookingId}&reason=${encodeURIComponent(errorMessage)}`
              );
            });
        },


        modal:{
          ondismiss:async function(){
            console.log("Payment window closed")
            await markPaymentAsFailed(bookingId,"user closed payment window")
            router.push(
              `/dashboard/tutor/${tutorId}/failure?bookingId=${bookingId}&reason=${encodeURIComponent("User closed payment window")}`
            );
          
          }

        },
        prefill: {
          name: tutor.name,
          email: tutor.email,
          contact: tutor.phone,
        },
        theme: {
          color: "#4b6cb7",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async function (response:RazorpayFailureResponse) {
        console.log("Payment failed:", response.error);
        await markPaymentAsFailed(bookingId, response.error.description || "Payment failed");
  
        router.push(
          `/dashboard/tutor/${tutorId}/failure?bookingId=${bookingId}&reason=${encodeURIComponent(response.error.description || "Payment failed")}`
        );
      });
      razorpay.open();
    } catch (error) {
      toast.error("Error confirming booking:");
     console.log("something went wrong",error)
    }
  };

  if (isLoading || !tutor) {
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

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-200 to-indigo-400 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative h-40 w-40 rounded-full bg-white p-1 overflow-hidden">
                {tutor.profilePhoto ? (
                  <Image
                    src={tutor.profilePhoto}
                    alt={tutor.name}
                    fill
                    className="object-cover rounded-full"
                    sizes="160px"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-400 text-white text-4xl font-semibold rounded-full">
                    {tutor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
                <div
                  className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white ${
                    tutor.isActive ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4 text-black">
                  {tutor.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-black">
                    <Languages className="h-4 w-4" />
                    <span>Teaches {tutor.teachLanguage}</span>
                  </div>
                  <div className="bg-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-black">
                    <Globe className="h-4 w-4" />
                    <span>{tutor.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8">
            <div className="flex space-x-8">
              {["about", "schedule"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-medium transition-colors relative ${
                    activeTab === tab
                      ? "text-purple-600 border-b-2 border-purple-500"
                      : "text-gray-500 hover:text-purple-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "about" && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-semibold mb-6">
                  Languages I Speak
                </h3>

                <div className="flex flex-wrap gap-3 mb-8">
                  {tutor.knownLanguages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-base font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-6">Weekly Schedule</h2>
                <div className="space-y-6">
                  {tutor.availability.map((daySchedule, index) => (
                    <div key={index} className="border-b last:border-0 pb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">
                        {new Date(daySchedule.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {daySchedule.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            className="px-4 py-2 border border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                            onClick={() =>
                              handleSlotSelection(daySchedule.date, slot)
                            }
                          >
                            {slot.startTime} - {slot.endTime}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">{tutor.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-600">
                    Timezone: {tutor.timeZone}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:opacity-90"
                onClick={handleBooking}
              >
                Book your class
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Book a Session with {tutor.name}
                </h2>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {tutor.availability.map((daySchedule, index) => (
                  <div key={index} className="border-b last:border-0 pb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      {new Date(daySchedule.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {daySchedule.slots.map((slot, idx) => (
                        <button
                          key={idx}
                          className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
                            ${
                              selectedDate === daySchedule.date &&
                              selectedSlot?.startTime === slot.startTime
                                ? "bg-purple-600 text-white"
                                : "border border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                            }`}
                          onClick={() =>
                            handleSlotSelection(daySchedule.date, slot)
                          }
                        >
                          {selectedDate === daySchedule.date &&
                          selectedSlot?.startTime === slot.startTime ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : null}
                          {slot.startTime} - {slot.endTime}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-lg">
                <strong className="text-red-600">Session Fee:</strong>
                <span className="text-xl font-semibold text-green-600">
                  ₹{tutor.hourlyRate} /hour
                </span>
              </p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={!selectedDate || !selectedSlot}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !selectedDate || !selectedSlot
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
                  } text-white`}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProtectedRoute(TutorProfilePage);
