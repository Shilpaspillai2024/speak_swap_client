export interface Booking {
  _id: string;
  tutorId: {
    name: string;
    profilePhoto: string;
    email: string;
  };
 
  selectedDay: string;
  selectedSlot: {
    startTime: string;
    endTime: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  sessionFee: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingDate: string;
  meetingLink?: string;
}


export interface tutorBooking {
    _id: string;
    userId: {
      fullName: string;
      email: string;
      phone?: string;
      profilePhoto?: string;
      knownLanguages: string[];
      learnLanguage: string;
      learnProficiency: string;
    };
    tutorId: {
      name: string;
      email: string;
      profilePhoto?: string;
      teachLanguage: string;
    };
    selectedDay: string;
    selectedSlot: {
      startTime: string;
      endTime: string;
    };
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    sessionFee: number;
    paymentStatus: 'paid' | 'pending' | 'failed';
    bookingDate: string;
    meetingLink?: string;
    createdAt: string;
  }

  export interface IBooking {
    _id: string;
    userId: {
      fullName: string;
      email: string;
      country:string;
      knownLanguages: string[];
      learnLanguage: string;
      learnProficiency: string;
    };
    tutorId: {
      name: string;
      email: string;
      country:string
      teachLanguage: string;
      knownLanguages:string[];
      timeZone:string;
    };
    selectedDay: string;
    selectedSlot: {
      startTime: string;
      endTime: string;
    };
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    sessionFee: number;
    paymentStatus: 'paid' | 'pending' | 'failed' ;
    bookingDate: string;
    meetingLink?: string;
    createdAt: string;
  }