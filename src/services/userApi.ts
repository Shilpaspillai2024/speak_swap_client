import axios from "axios";
import userAxiosInstance from "./userAxiosInstance";
import { IUser } from "@/types/user";
import { ITutor } from "@/types/tutor";
import { RazorpayResponse } from "@/types/razorpay";
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "An error occurred during registration"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred during registration";
    }
  }
  // } catch (error:any) {
  //   throw (
  //     error.response?.data?.error ||
  //     "Error occured during basic details registration"
  //   );
  // }
};

export const sendOtp = async (token: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup/send_otp`, {
      token,
    });
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while sending OTP";
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while sending OTP";
    }
  }
};

export const verifyOtp = async (data: OtpVerification) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup/verify_otp`, data);
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while verifying OTP";
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while verifying OTP";
    }
  }
};

export const setPassword = async (data: setPassword) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/signup/setpassword`,
      data
    );
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error ||
        "Error occurred while setting the password"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while setting the password";
    }
  }
};

export const updateProfile = async (data: profileDetails) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/signup/updateprofile`,
      data
    );

    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "Error occurred while adding the details"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while ading the details";
    }
  }
};

export const interest = async (data: interest) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup/interest`, data);
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "Error occurred while adding the interest"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while adding the interest";
    }
  }
};

export const uploadPicture = async (data: updatePicture) => {
  try {
    const formData = new FormData();
    formData.append("profilePhoto", data.profilePhoto);
    formData.append("token", data.token);
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error ||
        "Error occurred while uploading the picture"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while uploading the picture";
    }
  }
};

export const postLogin = async (email: string, password: string) => {
  try {
    const response = await userAxiosInstance.post(
      `/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await userAxiosInstance.post(`/refresh-token`);
    return response.data;
  } catch (error) {
    console.error("Errror refreshing token:", error);
    return null;
  }
};

export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while sending OTP";
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while sending OTP";
    }
  }
};

export const verifyForgotOtp = async (
  email: string,
  otp: string
): Promise<string> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/verify-otp`, {
      email,
      otp,
    });
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "Error occurred while verifying the OTP"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while verifying the OTP";
    }
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
): Promise<string> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/reset-password`, {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "Error occurred while reset the password"
      );
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while reset the password";
    }
  }
};

export const fetchUsers = async (): Promise<IUser[]> => {
  try {
    const response = await userAxiosInstance.get(`/users`);
    console.log("Fetched users:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in fetching user details");
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while fetching the details";
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while fetching the details";
    }
  }
};

export const fetchUserProfile = async (id: string) => {
  try {
    const response = await userAxiosInstance.get(`/user/${id}`);
    console.log("user response", response);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in fetching user profile details");
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while fetching the profile details";
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while fetching the profile details";
    }
  }
};

export const fetchProfile = async () => {
  try {
    const response = await userAxiosInstance.get(`/profile`);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in fetching user profile details");
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while fetching the profile details";
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred while fetching the profile details";
    }
  }
};

//update user

export const updateProfileDetails = async (updateData: Partial<IUser>) => {
  try {
    const response = await userAxiosInstance.put(`/update`, updateData);

    if (response.status !== 200) {
      throw new Error(response.data?.message || "Failed to update profile");
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message ||
        "An error occurred while updating the profile"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating the profile");
    }
  }
};

// get list Alltutors

export const listTutorsForUser = async (): Promise<ITutor[]> => {
  console.log("calling tutors");
  try {
    const response = await userAxiosInstance.get(`/tutors`);
    console.log("Fetched tutors:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in fetching tutor details");
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error ||
        "Error occurred while fetching the tutor details"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while fetching tutor details");
    }
  }
};

export const tutorProfile = async (tutorId: string): Promise<ITutor | null> => {
  try {
    const response = await userAxiosInstance.get(`/tutors/${tutorId}`);
    console.log("tutor propfile response", response);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in fetching tutor profile details");
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error ||
        "Error occurred while fetching the tutor profile details"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while fetching tutor profile");
    }
  }
};

export const createBooking = async (
  tutorId: string,
  selectedDay: string,
  selectedSlot: { startTime: string; endTime: string },
  sessionFee: number
) => {
  try {
    const response = await userAxiosInstance.post(`/booking/create`, {
      tutorId,
      selectedDay,
      selectedSlot,
      sessionFee,
    });

    console.log("response of create booking", response);
    return response.data;
  } catch (error: unknown) {
    console.log("Error in booking creation");

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Error occurred while booking"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while booking");
    }
  }
};

export const verifyPayment = async (response:RazorpayResponse, bookingId: string) => {
  try {
    const verifyResponse = await userAxiosInstance.post(
      "/booking/verify-payment",
      {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        bookingId: bookingId,
        tutorId: response.tutorId,
        amount: response.amount,
        creditedBy: response.creditedBy,
      }
    );
    console.log("Payment verification successful:", verifyResponse.data);
  } catch (error: unknown) {
    console.log("Error in payment verification");

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error || "Error occurred while verifying payment"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred during payment verification");
    }
  }
};

export const getBookingDetails = async (bookingId: string) => {
  try {
    const response = await userAxiosInstance.get(`/booking/${bookingId}`);
    console.log("bookingdetails", response);
    return response.data;
  } catch {
    throw new Error("Error fetching booking details");
  }
};

export const getBookedSlots = async (tutorId: string, selectedDay: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/booking/booked-slots/${tutorId}/${selectedDay}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    throw new Error("Error fetching booked slots");
  }
};

// fetch booking details for user

export const userbookingDetails = async () => {
  try {
    const response = await userAxiosInstance.get(`/booking/user/bookings`);
    console.log("response of booking", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw new Error("Error fetching booking details");
  }
};
