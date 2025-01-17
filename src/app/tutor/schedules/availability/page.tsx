"use client";
import React, { useState, useEffect } from "react";
import { Clock, Calendar, Plus, Trash2 } from "lucide-react";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";
import { setAvailability,deleteSlot,getAvailability} from "@/services/tutorApi";
import tutorAuthStore from "@/store/tutorAuthStore";
import { toast } from "react-toastify";


const saveTutorAvailability = async (schedule: any) => {
  const tutorId=tutorAuthStore.getState().tutor._id;
  console.log("tutorID",tutorId)

  console.log("Schedule",schedule);
  try {

    const response=await setAvailability(tutorId,schedule)
    console.log("availability set success fully")
    return response;
    
  } catch (error) {
   console.log("something went wrong try againg")
    throw new Error("Failed to save tutor availability");
  }

 
};

const TutorSchedule = () => {
  const [schedule, setSchedule] = useState<
    {
      day: string;
      slots: { startTime: string; endTime: string }[];
    }[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("");
  const tutorId=tutorAuthStore.getState().tutor._id;

  console.log("tutorId",tutorId)
  

  useEffect(() => {
    console.log("Fetching availability for tutorId:", tutorId); 
    const fetchTutorAvailability = async () => {
      try {
        const response = await getAvailability(tutorId);
        console.log("response in availabilty page",response)
        if (response) {
          setSchedule(response || []);
        }
      } catch (error) {
        toast.error("Failed to load availability");
      }
    };


    //  Get user's timezone
                // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                // setTimeZone(userTimeZone);
    // Set the user's timezone this for testing purpose
    const australianTimeZone = "Australia/Sydney";  
    setTimeZone(australianTimeZone);

    fetchTutorAvailability();
  }, [tutorId]);


  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const addTimeSlot = () => {
    if (!selectedDay || !startTime || !endTime) {
      alert("Please select day and time");
      return;
    }

    const formatTime=(time:string)=>{
      const date=new Date();
      const[hours,minutes]=time.split(":").map(Number);
      date.setHours(hours,minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }



  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
    setSchedule((prev) => {
      const daySchedule = prev.find((s) => s.day === selectedDay);
      if (daySchedule) {
        
        return prev.map((s) =>
          s.day === selectedDay
            ? {
                ...s,
                slots: [...s.slots, { startTime:formattedStartTime, endTime:formattedEndTime }],
              }
            : s
        );
      } else {
        
        return [
          ...prev,
          {
            day: selectedDay,
            slots: [{ startTime: formattedStartTime, endTime: formattedEndTime }],
          },
        ];
      }
    });

   
    setStartTime("");
    setEndTime("");
  };

  const removeTimeSlot=async(day:string,index:number)=>{

    try {
      await deleteSlot(tutorId,day,index)
      setSchedule((prev)=>

        prev.map((s)=>{
          if(s.day ===day){
            return{
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
    }

  };

  const handleSave = async () => {
    try {
      await saveTutorAvailability({schedule,timeZone});
      toast.success("Schedule saved successfully!");
    } catch (error) {
      toast.error("Failed to save schedule");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex">
        <TutorSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto ">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                  Set Your Teaching Schedule
                </h1>
                <p className="text-gray-600 mt-2">
                  Your current timezone: {timeZone}
                </p>
              </div>

              <div className="bg-teal-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Add New Time Slot
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  />

                  <button
                    onClick={addTimeSlot}
                    className="flex items-center justify-center gap-2 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700"
                  >
                    <Plus size={16} />
                    Add Slot
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Your Schedule
                </h2>
                {schedule.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No time slots added yet
                  </p>
                ) : (
                  <div className="space-y-6">
                    {daysOfWeek.map((day) => {
                      const daySchedule = schedule.find((s) => s.day === day);
                      if (!daySchedule?.slots.length) return null;

                      return (
                        <div key={day} className="border rounded-lg p-4">
                          <h3 className="font-medium text-gray-800 mb-3">
                            {day}
                          </h3>
                          <div className="space-y-2">
                            {daySchedule.slots.map((slot, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-teal-600" />
                                  <span>
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeTimeSlot(day, index)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSave}
                  className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700"
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

export default TutorSchedule;
