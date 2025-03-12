import axios from "axios";
import tutorAxiosInstance from "./tutorAxiosInstance";
import { AxiosError } from "axios";

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

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}
interface ApiError {
  message: string;
  error?: string;
}
export const tutorBasicDetails = async (data: signupBasicDetails) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/tutor/signup`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error ||
        "Error occurred during basic details registration"
      );
    }
    throw new Error("Unknown error occurred during basic details registration");
  }
};
export const sendOtp = async (token: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/tutor/signup/send_otp`, {
      token,
    });
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while sending otp";
    }
    throw new Error("Unknown error occurred while sending otp");
  }
};

export const verifyOtp = async (data: OtpVerification) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/tutor/signup/verify_otp`,
      data
    );
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while verifying otp";
    }
    throw new Error("Unknown error occurred while verifying otp");
  }
};

export const setPassword = async (data: setPassword) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/tutor/signup/setpassword`,
      data
    );
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "Error occurred while setting password"
      );
    }
    throw new Error("Unknown error occurred while setting password");
  }
};

export const tutorProfileSetup = async (data: tutorProfile) => {
  try {
    const formData = new FormData();

    formData.append("token", data.token);
    formData.append("dob", data.dob);
    formData.append("gender", data.gender);
    formData.append("country", data.country);
    formData.append("teachLanguage", data.teachLanguage);
    data.knownLanguages.forEach((lang) => {
      formData.append("knownLanguages[]", lang);
    });

    if (data.profilePhoto) {
      formData.append("profilePhoto", data.profilePhoto);
    }
    if (data.certificates.length > 0) {
      data.certificates.forEach((file) => {
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw (
        error.response.data?.error || "Error occurred while setting profile"
      );
    }
    throw new Error("Unknown error occurred while setting profile");
  }
};

export const tutorLogin = async (email: string, password: string) => {
  try {
    const response = await tutorAxiosInstance.post(
      `/tutor/login`,
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
    const response = await axios.post(
      `${BACKEND_URL}/tutor/refresh-token`,
      {},
      { withCredentials: true }
    );
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
    const response = await axios.post(`${BACKEND_URL}/tutor/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data?.error || "Error occurred while sending otp";
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyForgotOtp = async (
  email: string,
  otp: string
): Promise<string> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/tutor/verify-otp`, {
      email,
      otp,
    });
    return response.data.message;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw err?.error || "Error occurred while verifying OTP";
    }
    throw new Error("An unexpected error occurred");
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
): Promise<string> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/tutor/reset-password`, {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data.message;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw err?.error || "Error occurred while resetting password";
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchProfile = async () => {
  try {
    const response = await tutorAxiosInstance.get(`/tutor/profile`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      console.log("Error fetching user profile details");
      throw err?.error || "Error occurred while fetching the profile details";
    }
    throw new Error("An unexpected error occurred");
  }
};

export const setAvailability = async (
  tutorId: string,
  data: { schedule: DaySchedule[]; timeZone: string }
) => {
  console.log("schedule from tutorapi frontend:", data);
  try {
    const response = await tutorAxiosInstance.put(
      `/tutor/${tutorId}/availability`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw new Error(
        `Error setting availability: ${err?.message || error.message}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteSlot = async (
  tutorId: string,
  date: string,
  slotIndex: number
): Promise<void> => {
  try {
    console.log("Deleting slot:", tutorId, date, slotIndex);

    await tutorAxiosInstance.delete(
      `/tutor/${tutorId}/availability/${date}/${slotIndex}`
    );
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw new Error(err?.message || "Failed to delete slot");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAvailability = async (tutorId: string) => {
  try {
    const response = await tutorAxiosInstance.get(
      `/tutor/${tutorId}/availability`
    );
    console.log("tutor avilability geting from tutorapi", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw new Error(err?.message || "Failed to fetch availability");
    }
    throw new Error("An unexpected error occurred");
  }
};

// fetch tutor related bookings

export const getTutorBookings = async (page: number, limit: number) => {
  try {
    const response = await tutorAxiosInstance.get(`/booking/tutor/bookings`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw new Error(err?.message || "Failed to fetch bookings");
    }
    throw new Error("An unexpected error occurred");
  }
};

//update session status
export const startSession = async (bookingId: string) => {
  try {
    console.log("calling start session", bookingId);
    const response = await tutorAxiosInstance.patch(
      `/booking/start-session/${bookingId}`
    );
    console.log("response from backednd for start", response);
    return response.data;
  } catch (error: unknown) {
    console.error("Error starting session:", error);
    throw error;
  }
};

export const completeSession = async (bookingId: string) => {
  try {
    console.log("completed session calling", bookingId);
    const response = await tutorAxiosInstance.patch(
      `/booking/complete-session/${bookingId}`
    );
    console.log("completesession response", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error ending session:", error);
    throw error;
  }
};

//fetch wallet details

export const getWalletDetails = async () => {
  try {
    const response = await tutorAxiosInstance.get(`/tutor/wallet-details`);
    console.log("wallet response in frontednfectch", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw new Error(err?.message || "Failed to fetch wallet details");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const withdrawFunds = async (amount: number) => {
  try {
    const response = await tutorAxiosInstance.post(`/tutor/withdraw`, {
      amount,
    });
    console.log("response frm withdraw");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError;
      throw new Error(err?.message || "Failed to withdraw amount from wallet");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const cancelSession = async (bookingId: string) => {
  try {
    const response = await tutorAxiosInstance.put(
      `/booking/cancel/${bookingId}`
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Something went wrong";

    throw new Error(errorMessage);
  }
};

export const fetchDashboradData = async (tutorId: string) => {
  try {
    const response = await tutorAxiosInstance.get(
      `/booking/dashboard/${tutorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tutor dashboard data:", error);
    return {
      upcomingSessions: 0,
      completedSessions: 0,
      cancelledSessions: 0,
    };
  }
};

export const fetchEarnings = async (tutorId: string) => {
  try {
    const response = await tutorAxiosInstance(`/tutor/earnings/${tutorId}`);
    console.log("response of eranings", response);
    return response.data.earningData || [];
  } catch (error) {
    console.error("Error fetching tutor earnings data:", error);
    return [];
  }
};

export const logoutTutor = async () => {
  try {
    const response = await tutorAxiosInstance.post(`/tutor/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error("Logout failed.");
  }
};
