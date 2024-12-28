// types/user.ts

export interface IUser {
  _id:string;
  fullName:string;
  email:string;
  password:string;
  phone:string;
  isActive:boolean;
  country:string;
  nativeLanguage:string;
  knownLanguages:String[];
  learnLanguage:string;
  learnProficiency:string;
  talkAbout:string;
  learningGoal:string;
  whyChat:string;
  profilePhoto:string;
  isVerified:boolean;
  
  }
  