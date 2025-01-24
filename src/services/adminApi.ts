import axiosInstance from "./axiosInstance";

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/admin`, { email, password });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Incorrect email or password");
      }

      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("Network error: No response from server");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(error.message || "Unexpected error occurred");
    }
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post(`/admin/refresh-token`);
    return response.data;
  } catch (error) {
    console.error("Errror refreshing token:", error);
    return null;
  }
};

export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get(`/admin/users`);

    return response.data.users || [];
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

export const getTutors = async () => {
  try {
    const response = await axiosInstance.get("/admin/tutors/alltutors");
    console.log("api response:", response.data);

    return response.data.tutor || [];
  } catch (error) {
    console.error("error in fetching tutors:", error);
    throw error;
  }
};

export const getPendingTutors = async () => {
  try {
    const response = await axiosInstance.get("/admin/tutors/pending-tutors");
    return response.data.tutors || [];
  } catch (error) {
    console.error("error in fetching tutors:", error);
    throw error;
  }
};

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


export const getAllBookings =async()=>{
  try {
    
    const response = await axiosInstance.get(`/admin/bookings`);
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
