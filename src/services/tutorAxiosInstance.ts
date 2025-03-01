import axios from "axios";
import tutorAuthStore from "@/store/tutorAuthStore";
import { HttpStatus } from "@/constants/httpStatus";

const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL;


const tutorAxiosInstance =axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true,
})


tutorAxiosInstance.interceptors.request.use(
    (config) => {
      const tutorAuth= tutorAuthStore.getState();
      const token = tutorAuth.token;
  
      
      if (token) {
        console.log("Request - Adding Authorization Token:", token);
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("Request - No token found in store.");
      }
  
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

tutorAxiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        console.log("Interceptor Error:", error.response?.status, error.config);
        const tutorAuth=tutorAuthStore.getState()

        console.log("Interceptor - Token Before Request:", tutorAuth.token);
        const originalRequest=error.config;


        if(error.response.status ===HttpStatus.UNAUTHORIZED && !originalRequest._retry){
           
            originalRequest._retry=true;

            const isRefreshed=await tutorAuth.refreshAccessToken()
            if(isRefreshed){
                console.log("Retrying with New Token:", tutorAuth.token);
                originalRequest.headers["Authorization"] = `Bearer ${tutorAuth.token}`;
                return tutorAxiosInstance(originalRequest);

            }else{
                console.log("Refresh token failed. Logging out...");
                tutorAuth.Logout();
            }
        }

        return Promise.reject(error)
    }
);

export default tutorAxiosInstance