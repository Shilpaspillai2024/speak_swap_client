export interface ITutor {
    _id:string;
    name:string,
    email:string,
    phone:string,
    password:string,
    gender?: string; 
    dob?: Date;
    otp?:string;
    otpExpiration?:Date;
    isVerified:boolean;
    isActive:boolean;
    country:string;
    knownLanguages:string[];
    teachLanguage:string;
    profilePhoto:string;
    certificates:string[];
    introductionVideo:string;
    createdAt:Date;
    updatedAt:Date;
    status:"pending" | "approved" | "rejected";
    role: "tutor";
    timeZone:string;
    availability: IAvailability[];
    hourlyRate:number;
    
}

export interface ITimeSlot {
    startTime: string;
    endTime: string;
  }
  
  
 export interface IAvailability {
    date:string;
    slots: ITimeSlot[];
  }



  export interface TutorResponse{
    tutors: ITutor[];
    meta: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    }
  }