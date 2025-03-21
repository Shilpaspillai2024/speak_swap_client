import axios from "axios";
import axiosInstance from "./axiosInstance";
import { AxiosError } from "axios";
import { HttpStatus } from "@/constants/httpStatus";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ErrorResponse {
  message?: string;
}

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/admin`, { email, password });

    return response.data;
  } catch (error: unknown) {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        if (axiosError.response.status === HttpStatus.UNAUTHORIZED) {
          throw new Error("Incorrect email or password");
        }
        const errorMessage = axiosError.response.data?.message || "Login failed";
        throw new Error(errorMessage);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
        throw new Error("Network error: No response from server");
      }
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      throw new Error(error.message || "Unexpected error occurred");
    } else {
      console.error("Unknown error:", error);
      throw new Error("An unknown error occurred");
    }
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/admin/refresh-token`,
      {},
      { withCredentials: true } 
    );
    return response.data;
  } catch (error) {
    console.error("Errror refreshing token:", error);
    return null;
  }
};

export const getAllUser = async (page:number,limit:number) => {
  try {
    const response = await axiosInstance.get(`/admin/users`,{
      params:{
        page,
        limit
      },
    });

    return response.data|| [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const blockUnblockUser = async (userId: string, isActive: boolean) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}`, {
      isActive,
    });
    return response.data;
  } catch (error) {
    console.error("Error in block/unblock user:", error);
    throw error;
  }
};

export const getTutors = async (page:number,limit:number) => {
  try {
    const response = await axiosInstance.get("/admin/tutors/alltutors",{
      params:{
        page,
        limit
      }
    });
    console.log("api response:", response.data);

    return response.data || [];
  } catch (error) {
    console.error("error in fetching tutors:", error);
    throw error;
  }
};

export const getPendingTutors = async (page:number,limit:number) => {
  try {
    const response = await axiosInstance.get("/admin/tutors/pending-tutors",{
      params:{
        page,
        limit
      }
    });
    return response.data || [];
  } catch (error) {
    console.error("error in fetching tutors:", error);
    throw error;
  }
};

export const pendingTutorDetails =async(tutorId:string)=>{
  try {
    console.log("callig pending tutor by id")
    const response=await axiosInstance.get(`/admin/tutors/pending-tutor-details/${tutorId}`)
    console.log("pending tutors",response.data)
    return response.data
    
  } catch (error) {
    console.error("error in fetching tutors:", error);
    throw error;
  }
}

export const tutorVerify = async (
  tutorId: string,
  action: "approved" | "rejected"
) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/tutors/verify/${tutorId}/status`,
      {
        status: action,
      }
    );
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Error updating tutor status:", error);
  }
};

export const blockUnblockTutor = async (tutorId: string, isActive: boolean) => {
  try {
    const response = await axiosInstance.patch(`/admin/tutors/${tutorId}`, {
      isActive,
    });
    return response.data;
  } catch (error) {
    console.error("Error in block/unblock tutor:", error);
    throw error;
  }
};


export const getAllBookings =async(page:number,limit:number)=>{
  try {
    
    const response = await axiosInstance.get(`/admin/bookings`,{
      params:{
        page,
        limit
      }
    });
    console.log("response of booking in admin",response.data)
    return response.data;
  } catch (error) {
    console.error("Error in fetching bookings", error);
    throw error;
  }
}


export const getBookingDetails=async(bookingId:string)=>{
  try {
     
    const response =await axiosInstance.get(`/admin/bookings/${bookingId}`);
    console.log("response of bookingdetails from admin by bookingid",response.data)
    return response.data;
  } catch (error) {
    console.log("somtheing went wrong there",error)
  }
}

export const logoutAdmin = async () => {
  try {
    const response = await axiosInstance.post(`/admin/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error("Logout failed.");
  }
};



export const fetchadminDashboard=async()=>{
  try {
    console.log("in adminApi frontend dashnoard")
    const response=await axiosInstance.get(`/admin/dashboard`);
    console.log("admin dashboard response,",response)
    return response.data
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
}
