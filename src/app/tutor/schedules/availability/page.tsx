"use client";
import React, { useState, useEffect } from "react";
import { Clock,Plus, Trash2,Calendar } from "lucide-react";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";
import {
  setAvailability,
  deleteSlot,
  getAvailability,
} from "@/services/tutorApi";
import tutorAuthStore from "@/store/tutorAuthStore";
import { toast } from "react-toastify";
import TutorProtectedRoute from "@/HOC/TutorProtectedRoute";
interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

const saveTutorAvailability = async (data: { schedule: DaySchedule[]; timeZone: string }) => {
  const { schedule,timeZone} = data;


  const tutor=tutorAuthStore.getState().tutor 
  const tutorId=tutor?._id ?? ""
   
  console.log("tutorID", tutorId);

  console.log("Schedule", schedule);
  try {
     const response = await setAvailability(tutorId, { schedule, timeZone });
    console.log("availability set success fully");
    return response;
  } catch (error) {
    console.log("something went wrong try againg",error);
    throw new Error("Failed to save tutor availability");
  }
};

const TutorSchedule = () => {
  const [schedule, setSchedule] = useState<
    {
      date: string;
      slots: { startTime: string; endTime: string }[];
    }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("");

  

  const tutor=tutorAuthStore.getState().tutor 
  const tutorId=tutor?._id ?? ""
   console.log("tutorId", tutorId);
  

  useEffect(() => {
    console.log("Fetching availability for tutorId:", tutorId);
    const fetchTutorAvailability = async () => {
      try {
        const response = await getAvailability(tutorId);
        console.log("response in availabilty page", response);
        if (response) {
          setSchedule(response || []);
        }
      } catch (error) {
        toast.error("Failed to load availability");
        console.error("something went wrong", error);
      }
    };

    //  Get user's timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(userTimeZone);

    // Set the user's timezone this for testing purpose
    // const australianTimeZone = "Australia/Sydney";
    // setTimeZone(australianTimeZone);

    fetchTutorAvailability();
  }, [tutorId]);

 

  const addTimeSlot = () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select a date and time");
      return;
    }

    const formatTime = (time: string) => {
      const date = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      date.setHours(hours, minutes);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    setSchedule((prev) => {
      const dateSchedule = prev.find((s) => s.date === selectedDate);
      if (dateSchedule) {
        return prev.map((s) =>
          s.date === selectedDate
            ? {
                ...s,
                slots: [
                  ...s.slots,
                  { startTime: formattedStartTime, endTime: formattedEndTime },
                ],
              }
            : s
        );
      } else {
        return [
          ...prev,
          {
            date: selectedDate,
            slots: [
              { startTime: formattedStartTime, endTime: formattedEndTime },
            ],
          },
        ];
      }
    });

    setStartTime("");
    setEndTime("");
  };

  const removeTimeSlot = async (date: string, index: number) => {
    try {
      await deleteSlot(tutorId, date, index);
      setSchedule((prev) =>
        prev
          .map((s) => {
            if (s.date === date) {
              return {
                ...s,
                slots: s.slots.filter((_, i) => i !== index),
              };
            }
            return s;
          })
          .filter((s) => s.slots.length > 0)
      );
      toast.success("Slot deleted successfully");
    } catch (error) {
      toast.error("Failed to delete slot");
      console.log("failed to delete slot",error)
    }
  };

  const handleSave = async () => {
    try {
      await saveTutorAvailability({ schedule, timeZone });
      toast.success("Schedule saved successfully!");
    } catch (error) {
      toast.error("Failed to save schedule");
      console.log("failed to save schedule",error)
    }
  };

  const sortedSchedule = [...schedule].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );


  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TutorNavbar />
      <div className="flex flex-1">
        <div className="h-full bg-white shadow-lg">
          <TutorSidebar />
        </div>
        <div className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 backdrop-blur-lg backdrop-filter border border-gray-100">
              <div className="mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-700 text-center">
                  Set Your Teaching Schedule
                </h1>
                <div className="flex items-center justify-center mt-4 text-gray-600 text-sm md:text-base">
                  <Clock size={18} className="mr-2 text-blue-500" />
                  <p>Current timezone: {timeZone}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 md:p-8 mb-10">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Calendar size={20} className="mr-2 text-blue-500" />
                  Add New Time Slot
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={addTimeSlot}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white p-3 rounded-lg hover:from-teal-600 hover:to-purple-600 transition-all duration-200 transform hover:-translate-y-1"
                    >
                      <Plus size={20} />
                      Add Slot
                    </button>
                  </div>
                </div>
              </div>

              <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Clock size={20} className="mr-2 text-blue-500" />
                  Your Schedule
                </h2>
                {sortedSchedule.length === 0 ? (
                  <div className="text-center py-8 md:py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-base md:text-lg">No time slots added yet</p>
                </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {sortedSchedule.map((entry, index) => (
                      <div
                        key={`${entry.date}-${index}`}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <h3 className="font-semibold text-lg text-gray-800 mb-4 pb-2 border-b">
                          {new Date(entry.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <div className="space-y-3">
                          {entry.slots.map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg group hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Clock size={18} className="text-blue-500" />
                                <span className="font-medium text-gray-700">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              <button
                                onClick={() => removeTimeSlot(entry.date, idx)}
                                className="text-red-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all duration-200"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 md:mt-10">
                <button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-teal-500 to-purple-500 text-white py-3 md:py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-purple-600 transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProtectedRoute(TutorSchedule);

