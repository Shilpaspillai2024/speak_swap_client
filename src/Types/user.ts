// types/user.ts

export interface IUser {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isActive: boolean;
    continent: string;
    country: string;
    nativeLanguage: string;
    proficiency: string;
    knownLanguages: string[]; // Use string[] for an array of strings
    learnLanguage: string;
    learnProficiency: string;
    talkAbout: string;
    learningGoal: string;
    whyChat: string;
    profilePhoto: string;
    otp?: string;
    otpExpiration?: Date;
    isVerified: boolean;
  }
  