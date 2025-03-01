import axios from "axios";
import useAdminAuthStore from "@/store/adminAuthStore";
import { HttpStatus } from "@/constants/httpStatus";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const adminAuthStore = useAdminAuthStore.getState();
    const token = adminAuthStore.token;

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

axiosInstance.interceptors.response.use(
  (response)=>response,
  async(error)=>{
      console.log("Interceptor Error:", error.response?.status, error.config);
      const adminAuthStore=useAdminAuthStore.getState()

      console.log("Interceptor - Token Before Request:", adminAuthStore.token);
      const originalRequest=error.config;


      if(error.response.status === HttpStatus.UNAUTHORIZED && !originalRequest._retry){
         
          originalRequest._retry=true;

          const isRefreshed=await adminAuthStore.refreshAccessToken()
          if(isRefreshed){
              console.log("Retrying with New Token:", adminAuthStore.token);
              originalRequest.headers["Authorization"] = `Bearer ${adminAuthStore.token}`;
              return axiosInstance(originalRequest);

          }else{
              console.log("Refresh token failed. Logging out...");
              adminAuthStore.adminLogout();
          }
      }

      return Promise.reject(error)
  }
);



export default axiosInstance;
