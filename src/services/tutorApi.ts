import axios from "axios";
import tutorAxiosInstance from "./tutorAxiosInstance";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface signupBasicDetails {
  name: string;
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

export interface tutorProfile {
  token: string;
  dob: string;
  gender: string;
  country: string;
  teachLanguage: string;
  knownLanguages: string[];
  profilePhoto: File | null;
  certificates: File[]; // Multiple files
  introductionVideo: File | null;
}

export const tutorBasicDetails = async (data: signupBasicDetails) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/tutor/signup`, data);
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
    const response = await axios.post(`${BACKEND_URL}/tutor/signup/send_otp`, {
      token,
    });
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while sending otp";
  }
};

export const verifyOtp = async (data: OtpVerification) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/tutor/signup/verify_otp`,
      data
    );
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while verifying otp";
  }
};

export const setPassword = async (data: setPassword) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/tutor/signup/setpassword`,
      data
    );
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while setting password";
  }
};

export const tutorProfileSetup = async (data: tutorProfile) => {
  try {
    const formData = new FormData();

    formData.append("token",data.token);
    formData.append("dob", data.dob);
    formData.append("gender", data.gender);
    formData.append("country", data.country);
    formData.append("teachLanguage", data.teachLanguage);
    formData.append("knownLanguages", JSON.stringify(data.knownLanguages));

    if (data.profilePhoto) {
      formData.append("profilePhoto", data.profilePhoto);
    }
    if (data.certificates.length > 0) {
      data.certificates.forEach((file, index) => {
        formData.append("certificates", file);
      });
    }
    if (data.introductionVideo) {
      formData.append("introductionVideo", data.introductionVideo);
    }

    const response = await axios.post(
      `${BACKEND_URL}/tutor/signup/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Error occured while setting password";
  }
};


export const tutorLogin =async(email:string,password:string)=>{
  try {

    const response=await tutorAxiosInstance.post(`/tutor/login`,{email,password},{
      headers:{
        'Content-Type':'application/json'
    },
    
    })
    return response.data
    
  } catch (error:any) {
    if (error.response && error.response.data) {
      const message = error.response.data?.message || "Login failed";
      return { error: message };
      
    }

    
    return { error: "An unexpected error occurred. Please try again." };
  }
    
    
  }




  export const refreshToken=async()=>{
    try {
  
      const response=await tutorAxiosInstance.post(`/refresh-token`)
      return response.data
      
    } catch (error) {
      console.error("Errror refreshing token:",error);
      return null
      
    }
  
  
  };
  


export const forgotPassword=async(email:string):Promise<{ message: string }>=>{
  try {
    const response=await axios.post(`${BACKEND_URL}/tutor/forgot-password`,{email})
    return response.data
    
  } catch (error:any) {
    throw error.response?.data?.error || "Error occured while sending otp";
    
  }
}


export const verifyForgotOtp=async(email:string,otp:string): Promise<string>=>{
  try {
    const response=await axios.post(`${BACKEND_URL}/tutor/verify-otp`,{email,otp})
    return response.data.message
    
  } catch (error:any) {
    throw error.response?.data?.error || "Error occured while verifying otp";
    
  }
}


export const resetPassword=async(email:string,newPassword:string,confirmPassword:string):Promise<string>=>{
  try {
    const response=await axios.post(`${BACKEND_URL}/tutor/reset-password`,{email,newPassword,confirmPassword})
    return response.data.message
    
  } catch (error:any) {
    throw error.response?.data?.error || "Error occured while verifying otp";
    
  }
}