export  interface IBooking {
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