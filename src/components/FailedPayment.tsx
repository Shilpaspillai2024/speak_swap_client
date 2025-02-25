// "use client";
// import React, { useEffect, useState } from 'react';
// import { AlertTriangle, RefreshCw } from 'lucide-react';
// import { getFailedBookings} from '@/services/userApi';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// interface FailedBooking {
//   _id: string;
//   tutorId: {
//     _id: string;
//     name: string;
//     profilePhoto?: string;
//   };
//   selectedDate: string;
//   selectedSlot: {
//     startTime: string;
//     endTime: string;
//   };
//   sessionFee: number;
//   failureReason?: string;
//   bookingDate: string;
// }

// const FailedPayments = () => {
//   const [failedBookings, setFailedBookings] = useState<FailedBooking[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchFailedBookings = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getFailedBookings();
//         if (response.success) {
//           setFailedBookings(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching failed bookings:', error);
//         toast.error('Failed to load payment history');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFailedBookings();
//   }, []);

//   const handleRetryPayment = (booking: FailedBooking) => {
//     router.push(`/dashboard/tutor/${booking.tutorId._id}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-md p-6 w-full">
//         <h2 className="text-xl font-semibold mb-6">Failed Payments</h2>
//         <div className="flex justify-center p-10">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (failedBookings.length === 0) {
//     return null; 
//   }
//   return (
//     <div className="bg-white rounded-xl shadow-md p-6 w-full mb-8">
//       <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
//         <AlertTriangle className="text-red-500 h-5 w-5" />
//         Failed Payments
//       </h2>

//       <div className="space-y-4">
//         {failedBookings.map((booking) => (
//           <div key={booking._id} className="border border-red-100 rounded-lg p-4 bg-red-50">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//               <div>
//                 <h3 className="font-medium text-gray-900">{booking.tutorId.name}</h3>
//                 <p className="text-sm text-gray-600">
//                   {new Date(booking.selectedDate).toLocaleDateString('en-US', {
//                     weekday: 'long',
//                     month: 'long',
//                     day: 'numeric',
//                   })}
//                   {' • '}
//                   {booking.selectedSlot.startTime} - {booking.selectedSlot.endTime}
//                 </p>
//                 <p className="text-sm text-red-600 mt-1">
//                   {booking.failureReason || 'Payment processing failed'}
//                 </p>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 <div className="font-medium">${booking.sessionFee}</div>
//                 <button
//                   onClick={() => handleRetryPayment(booking)}
//                   className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1 rounded-md border border-indigo-200"
//                 >
//                   <RefreshCw className="h-4 w-4" />
//                   Retry
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default FailedPayments;