import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface TutorAuthState {
  tutor: any | null;
  token: string | null;
  isTutorAuthenticated: boolean;
  isLoading: boolean;
  setTutorAuth: (tutor: any, token: string) => void;
  setTutor: (tutor: any) => void;
  Logout: () => void;
  initAuth: () => Promise<void>;
  checkTokenValidity: () => boolean;
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
            localStorage.setItem("tutor", JSON.stringify(tutor));
            localStorage.setItem("tutorAccessToken", token);
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
          localStorage.removeItem("tutor");
          localStorage.removeItem("tutorAccessToken");
          set({
            tutor: null,
            token: null,
            isTutorAuthenticated: false,
            isLoading: false,
          });
        },

        // initAuth: async () => {
        //   const tutor = JSON.parse(localStorage.getItem("tutor") || "null");
        //   const token = localStorage.getItem("tutorAccessToken");

        //   if (tutor && token && get().checkTokenValidity()) {
        //     set({ tutor, isTutorAuthenticated: true, isLoading: false });
        //   } else {
        //     get().Logout();
          
        //   }
        // },


        initAuth: async () => {
          const token = localStorage.getItem("tutorAccessToken");
        
          if (!token) {
            console.warn("No token found during initAuth.");
            get().Logout(); 
            return;
          }
        
          const tutor = JSON.parse(localStorage.getItem("tutor") || "null");
        
          if (tutor && get().checkTokenValidity()) {
            set({ tutor, token, isTutorAuthenticated: true, isLoading: false });
          } else {
            console.warn("Token is invalid or tutor data is missing.");
            get().Logout(); 
          }
        },

        checkTokenValidity: () => {
          const token = localStorage.getItem("tutorAccessToken");
         
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
      }),
      {
        name: "tutor-auth",
      }
    ),

    { name: "TutorAuthStore" }
  )
);

export default tutorAuthStore;
