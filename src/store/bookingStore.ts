import {create} from 'zustand'

export interface BookingDetails{
    bookingId: string;
    userId: string;
    tutorId: string;
    selectedDate: string;
    selectedSlot: { startTime: string; endTime: string };
    userRole: 'user' | 'tutor';
  }




interface BookingStore {
    bookingDetails: BookingDetails | null;
    setBookingDetails: (details: BookingDetails) => void;
  }
  
  export const useBookingStore = create<BookingStore>((set) => ({
    bookingDetails: null,
    setBookingDetails: (details) => set({ bookingDetails: details }),
  }));