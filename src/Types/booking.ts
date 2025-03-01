export interface Booking {
  _id: string;
  tutorId: {
    name: string;
    profilePhoto: string;
    email: string;
  };
 
  selectedDate: string;
  selectedSlot: {
    startTime: string;
    endTime: string;
  };
  status: 'pending' | 'confirmed' |'in-progress'| 'completed' | 'cancelled';
  sessionFee: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingDate: string;
 
}


export interface tutorBooking {
    _id: string;
    userId: {
      _id:string;
      fullName: string;
      email: string;
      phone?: string;
      profilePhoto?: string;
      knownLanguages: string[];
      learnLanguage: string;
      learnProficiency: string;
    };
    tutorId: {
      _id:string;
      name: string;
      email: string;
      profilePhoto?: string;
      teachLanguage: string;
    };
    selectedDate: string;
    selectedSlot: {
      startTime: string;
      endTime: string;
    };
    status: 'pending' | 'confirmed' | 'in-progress'| 'completed' | 'cancelled' |'payment_failed';
    sessionFee: number;
    paymentStatus: 'paid' | 'pending' | 'failed';
    bookingDate: string;
    createdAt: string;
  }

  export interface IBooking {
    _id: string;
    userId: {
      _id:string;
      fullName: string;
      email: string;
      country:string;
      knownLanguages: string[];
      learnLanguage: string;
      learnProficiency: string;
    };
    tutorId: {
      _id:string;
      name: string;
      profilePhoto: string;
      email: string;
      country:string
      teachLanguage: string;
      knownLanguages:string[];
      timeZone:string;
    };
    selectedDate: string;
    selectedSlot: {
      startTime: string;
      endTime: string;
    };
    status: 'pending' | 'confirmed' | 'in-progress'| 'completed' | 'cancelled'|'payment_failed';
    sessionFee: number;
    paymentStatus: 'paid' | 'pending' | 'failed' ;
    bookingDate: string;
    createdAt: string;
  }

  