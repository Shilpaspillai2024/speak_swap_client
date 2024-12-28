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
    status:"pending" | "approved" | "rejected"

    
}