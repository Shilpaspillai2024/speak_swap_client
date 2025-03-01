import axios from "axios";
import userAuthStore from "@/store/userAuthStore";
import { HttpStatus } from "@/constants/httpStatus";

const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL;


const userAxiosInstance =axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true,
})


userAxiosInstance.interceptors.request.use(
    (config) => {
      const userAuth= userAuthStore.getState();
      const token = userAuth.token;
  
      
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

userAxiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        console.log("Interceptor Error:", error.response?.status, error.config);
        const userAuth=userAuthStore.getState()

        console.log("Interceptor - Token Before Request:", userAuth.token);
        const originalRequest=error.config;


        if(error.response?.status ===HttpStatus.UNAUTHORIZED && !originalRequest._retry){
           
            originalRequest._retry=true;

            const isRefreshed=await userAuth.refreshAccessToken()
            if(isRefreshed){
                console.log("Retrying with New Token:", userAuth.token);
                originalRequest.headers["Authorization"] = `Bearer ${userAuth.token}`;
                return userAxiosInstance(originalRequest);

            }else{
                console.log("Refresh token failed. Logging out...");
                userAuth.Logout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error)
    }
);

export default userAxiosInstance