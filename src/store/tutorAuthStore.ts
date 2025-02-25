import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { logoutTutor, refreshToken } from "@/services/tutorApi";
import { ITutor } from "@/types/tutor";

interface TutorAuthState {
  tutor: ITutor | null;
  token: string | null;
  isTutorAuthenticated: boolean;
  isLoading: boolean;
  setTutorAuth: (tutor:ITutor, token: string) => void;
  setTutor: (tutor:ITutor) => void;
  Logout: () => void;
  initAuth: () => Promise<void>;
  refreshAccessToken:()=>Promise<boolean>;
  checkTokenValidity: () => Promise<boolean>;
}

interface DecodedToken {
  exp: number;
  iat: number;
  tutorId: string;
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
        Logout: async() => {
          console.log("Logging out...");
          await logoutTutor();
          set({
            tutor: null,
            token: null,
            isTutorAuthenticated: false,
            isLoading: false,
          });

          localStorage.removeItem("tutor-auth");
        },


        initAuth: async () => {
       
          const{token,checkTokenValidity,refreshAccessToken,tutor,Logout}=get()
          if (!token) {
            console.warn("No token found during initAuth.");
            Logout(); 
            return;
          }
        
         
          const isValid=await checkTokenValidity();
          if(!isValid){
            const isRefreshed=await refreshAccessToken()
            if(!isRefreshed){
              Logout();
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
         
            const decodedToken = jwtDecode<DecodedToken>(token);
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
            if(data?.accessToken){
              set({token:data.accessToken,
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
