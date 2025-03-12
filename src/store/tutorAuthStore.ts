import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { logoutTutor, refreshToken } from "@/services/tutorApi";
import { ITutor } from "@/types/tutor";

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

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
       
          const{token,checkTokenValidity,refreshAccessToken,tutor}=get()
          if (!token) {
            console.warn("No token found during initAuth.");
            set({ isLoading: false, isTutorAuthenticated: false }); 
            return;
           
          }
        
         
          const isValid=await checkTokenValidity();
          if(!isValid){
            const isRefreshed=await refreshAccessToken()
            if(!isRefreshed){
              set({ isTutorAuthenticated: false, isLoading: false, token: null });
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


        // refreshAccessToken:async()=>{
        //   try {
        //     const data=await refreshToken()
        //     if(data?.accessToken){
        //       set({token:data.accessToken,
        //         isTutorAuthenticated:true
        //       });
        //       return true;
        //     }
        //     return false;
            
        //   } catch (error) {
        //     console.error("Token refresh error:", error);
        //     get().Logout();
        //     return false;
            
        //   }
        // }

          refreshAccessToken: async () => {
                  if (refreshing && refreshPromise) {
                   
                    return refreshPromise;
                  }
                  
                  refreshing = true;
                  refreshPromise = (async () => {
                    try {
                      const response = await refreshToken();
                      if (response?.accessToken) {
                        set({
                          token: response.accessToken,
                          isTutorAuthenticated:true
                        });
                        return true;
                      }
                      console.warn("Refresh token request failed, marking as unauthenticated.");
                      set({ isTutorAuthenticated: false, token: null });
                      return false;
                    } catch (error) {
                      console.error("Token refresh error:", error);
                      set({ isTutorAuthenticated: false, token: null });
                      return false;
                    } finally {
                      refreshing = false;
                      refreshPromise = null;
                    }
                  })();
                  
                  return refreshPromise;
                },
      }),
      {
        name: "tutor-auth",
      }
    ),

    { name: "TutorAuthStore" }
  )
);

export default tutorAuthStore;
