import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface UserAuthState {
  user: any | null;
  token: string | null;
  isUserAuthenticated: boolean;
  isLoading: boolean;
  setUserAuth: (user: any, token: string) => void;
  setUser: (user: any) => void;
  Logout: () => void;
  initAuth: () => Promise<void>;
  checkTokenValidity: () => boolean;
}

const userAuthStore = create<UserAuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isUserAuthenticated: false,
        isLoading: true,

        setUserAuth: (user, token) => {
          if (token) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userAccessToken", token);
            set({
              user,
              token,
              isUserAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.error("No token provided.");
          }
        },

        setUser: (user) => {
          set({ user });
        },
        Logout: () => {
          console.log("Logging out...");
          localStorage.removeItem("user");
          localStorage.removeItem("userAccessToken");
          set({
            user: null,
            token: null,
            isUserAuthenticated: false,
            isLoading: false,
          });
        },

        initAuth: async () => {
          const user = JSON.parse(localStorage.getItem("user") || "null");
          const token = localStorage.getItem("userAccessToken");

          if (user && token && get().checkTokenValidity()) {
            set({ user, isUserAuthenticated: true, isLoading: false });
          } else {
            get().Logout();
          
          }
        },

        checkTokenValidity: () => {
          const token = localStorage.getItem("userAccessToken");
         
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
        name: "user-auth",
      }
    ),

    { name: "UserAuthStore" }
  )
);

export default userAuthStore;
