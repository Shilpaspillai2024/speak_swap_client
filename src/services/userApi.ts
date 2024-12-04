import axios from "axios";

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

    const response=await axios.post(`${BACKEND_URL}/login`,{email,password},{
      headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true,
    })
    return response.data
    
  } catch (error) {
    
  }
}
