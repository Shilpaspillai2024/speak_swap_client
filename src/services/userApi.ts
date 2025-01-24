import axios from "axios";
import userAxiosInstance from "./userAxiosInstance";
import { IUser } from "@/types/user";
import { ITutor } from "@/types/tutor";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface signupBasicDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface OtpVerification {
  token: string;
  otp: string;
}

export interface setPassword {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface profileDetails {
  token: string;
  country: string;
  nativeLanguage: string;
  knownLanguages: string[];
  learnLanguage: string;
  learnProficiency: string;
}

export interface interest {
  token: string;
  talkAbout: string;
  learningGoal: string;
  whyChat: string;
}
export interface updatePicture {
  token: string;
  profilePhoto: File;
}

export const signupBasicDatails = async (data: signupBasicDetails) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/signup/basic_details`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.error ||
      "Error occured during basic details registration"
    );
  }
};

export const sendOtp = async (token: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup/send_otp`, {
      token,
    });
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while sending otp";
  }
};

export const verifyOtp = async (data: OtpVerification) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup/verify_otp`, data);
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while verifying otp";
  }
};

export const setPassword = async (data: setPassword) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/signup/setpassword`,
      data
    );
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while setting password";
  }
};

export const updateProfile = async (data: profileDetails) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/signup/updateprofile`,
      data
    );

    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while adding detatils";
  }
};

export const interest = async (data: interest) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup/interest`, data);
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while adding interest";
  }
};

export const uploadPicture = async (data: updatePicture) => {
  try {
    const formData = new FormData();
    formData.append("profilePhoto", data.profilePhoto);
    formData.append("token",data.token);
    const response = await axios.post(
      `${BACKEND_URL}/signup/upload_profile_picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.message;
  } catch (error: any) {
    throw (
      error.response?.data?.error ||
      "Error occured while uploading profile picture"
    );
  }
};


export const postLogin =async(email:string,password:string)=>{
  try {

    const response=await userAxiosInstance.post(`/login`,{email,password},{
      headers:{
        'Content-Type':'application/json'
    },
   
    })
    return response.data
    
  } catch (error:any) {
    if (axios.isAxiosError(error)) {

      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message); 
      }
    }
    throw error
    
  
  }
}


export const refreshToken=async()=>{
  try {

    const response=await userAxiosInstance.post(`/refresh-token`)
    return response.data
    
  } catch (error) {
    console.error("Errror refreshing token:",error);
    return null
    
  }


};


export const forgotPassword=async(email:string):Promise<{ message: string }>=>{
  try {
    const response=await axios.post(`${BACKEND_URL}/forgot-password`,{email})
    return response.data
    
  } catch (error:any) {
    throw error.response?.data?.error || "Error occured while sending otp";
    
  }
}


export const verifyForgotOtp=async(email:string,otp:string): Promise<string>=>{
  try {
    const response=await axios.post(`${BACKEND_URL}/verify-otp`,{email,otp})
    return response.data.message
    
  } catch (error:any) {
    throw error.response?.data?.error || "Error occured while verifying otp";
    
  }
}


export const resetPassword=async(email:string,newPassword:string,confirmPassword:string):Promise<string>=>{
  try {
    const response=await axios.post(`${BACKEND_URL}/reset-password`,{email,newPassword,confirmPassword})
    return response.data.message
    
  } catch (error:any) {
    throw error.response?.data?.error || "Error occured in reset password";
    
  }
}


export const fetchUsers=async():Promise<any>=>{
  try {
    const response=await userAxiosInstance.get(`/users`)
    console.log("Fetched users:", response.data);
    return response.data
    
  } catch (error:any) {
    console.log('Error infetching user details')
    throw error.response?.data?.error || "Error occured while fetching the details";
    
    
  }
}

export const fetchUserProfile=async(id:string)=>{


  try {
    const response=await userAxiosInstance.get(`/user/${id}`)
    console.log("user response",response)
    return response.data;
    
  } catch (error:any) {
    console.log('Error infetching user profile details')
    throw error.response?.data?.error || "Error occured while fetching the profile details";
    
    
  }
}


export const fetchProfile=async()=>{
  try {
    const response=await userAxiosInstance.get(`/profile`);
    return response.data
    
  } catch (error:any) {
    console.log('Error infetching user profile details')
    throw error.response?.data?.error || "Error occured while fetching the profile details";
    
  }
}


//update user

export const updateProfileDetails=async(updateData:Partial<IUser>)=>{


  try {

    const response=await userAxiosInstance.put(`/update`,updateData)

    if (response.status !== 200) {
      throw new Error(response.data?.message || "Failed to update profile");
    }

    return response.data
    
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "An error occurred while updating the profile");
  }
}


// get list Alltutors

export const listTutorsForUser=async():Promise<ITutor[]>=>{
  console.log("calling utors")
  try {
    const response =await userAxiosInstance.get(`/tutors`)
    console.log("Fetched tutors:", response.data);
    return response.data
  } catch (error:any) {
    console.log('Error infetching user details')
    throw error.response?.data?.error || "Error occured while fetching the details";
    
    
  }
}


export const tutorProfile=async(tutorId:string):Promise<ITutor | null>=>{
  try {
    const response=await userAxiosInstance.get(`/tutors/${tutorId}`)
    console.log("tutor propfile response",response)
    return response.data;
    
  } catch (error:any) {
    console.log('Error infetching tutor profile details')
    throw error.response?.data?.error || "Error occured while fetching the profile details";
    
    
  }
}


export const createBooking=async(tutorId: string, selectedDay: string, selectedSlot: { startTime: string, endTime: string }, sessionFee: number) => {
  try {

    const response=await userAxiosInstance.post(`/booking/create`,{
      tutorId,
      selectedDay,
      selectedSlot,
      sessionFee
    })

    console.log("response of create booking",response)
    return response.data;
    
  } catch (error:any) {
    console.log('Error in booking creation')
    throw error.response?.data?.error || "Error occured while booking";
  }
}

export const verifyPayment=async(response: any, bookingId: string)=>{
  try {

    const verifyResponse=await userAxiosInstance.post('/booking/verify-payment',{
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      signature: response.razorpay_signature,
      bookingId: bookingId,
      tutorId: response.tutorId, 
      amount: response.amount,   
      creditedBy:response.creditedBy  ,

    })
    console.log('Payment verification successful:', verifyResponse.data);
    
  } catch (error:any) {
    console.log('Error in payment verify')
    throw error.response?.data?.error || "Error occured while verify";
  }
}

export const getBookingDetails=async(bookingId:string)=>{
   try {


    const response = await userAxiosInstance.get(`/booking/${bookingId}`);  
    console.log("bookingdetails",response)
    return response.data;
    
   } catch (error) {
    throw new Error('Error fetching booking details');
   }
}

export const getBookedSlots=async(tutorId:string,selectedDay:string)=>{
  try {
    const response=await userAxiosInstance.get(`/booking/booked-slots/${tutorId}/${selectedDay}`)
    return response.data;
  } catch (error) {
    throw new Error("Error fetching booked slots");
  }
}


// fetch booking details for user

export const userbookingDetails=async()=>{
  try {
    
    const response =await userAxiosInstance.get(`/booking/user/bookings`)
    console.log("response of booking",response)
    return response.data;
    
  } catch (error) {
    throw new Error("Error fetching booking details");
  }
}
