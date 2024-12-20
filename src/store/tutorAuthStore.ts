import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/services/tutorApi";

interface TutorAuthState {
  tutor: any | null;
  token: string | null;
  isTutorAuthenticated: boolean;
  isLoading: boolean;
  setTutorAuth: (tutor: any, token: string) => void;
  setTutor: (tutor: any) => void;
  Logout: () => void;
  initAuth: () => Promise<void>;
  refreshAccessToken:()=>Promise<boolean>;
  checkTokenValidity: () => Promise<boolean>;
}

const tutorAuthStore = create<TutorAuthState>()(
  devtools(
    persist(
      (set, get) => ({
        tutor: null,
        token: null,
        isTutorAuthenticated: false,
        isLoading: true,

        setTutorAuth: (tutor, token) => {
          if (token) {
           
            set({
              tutor,
              token,
              isTutorAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.error("No token provided.");
          }
        },

        setTutor: (tutor) => {
          set({ tutor });
        },
        Logout: () => {
          console.log("Logging out...");
          set({
            tutor: null,
            token: null,
            isTutorAuthenticated: false,
            isLoading: false,
          });
        },


        initAuth: async () => {
       
          const{token,checkTokenValidity,refreshAccessToken,tutor}=get()
          if (!token) {
            console.warn("No token found during initAuth.");
            get().Logout(); 
            return;
          }
        
         
          const isValid=await checkTokenValidity();
          if(!isValid){
            const isRefreshed=await refreshAccessToken()
            if(!isRefreshed){
              get().Logout();
              return;
            }
          }
            set({
              tutor,
              isTutorAuthenticated:true,
              isLoading:false,
            });
          },
  
        checkTokenValidity:async () => {
          const {token}=get();
         
          if (!token) {
            console.error("Token is missing");
            return false;
          }

          try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
          } catch (error) {
            console.error("Error decoding token:", error);
            return false;
          }
        },


        refreshAccessToken:async()=>{
          try {
            const data=await refreshToken()
            if(data?.accesToken){
              set({token:data.accesToken,
                isTutorAuthenticated:true
              });
              return true;
            }
            return false;
            
          } catch (error) {
            console.error("Token refresh error:", error);
            get().Logout();
            return false;
            
          }
        }
      }),
      {
        name: "tutor-auth",
      }
    ),

    { name: "TutorAuthStore" }
  )
);

export default tutorAuthStore;
