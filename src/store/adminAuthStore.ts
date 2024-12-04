import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface AdminAuthState {
  admin: any | null;
  token: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  setAdminAuth: (admin: any, token: string) => void;
  setAdmin: (admin: any) => void;
  adminLogout: () => void;
  initAdminAuth: () => Promise<void>;
  checkTokenValidity: () => boolean;
}

const useAdminAuthStore = create<AdminAuthState>()(
  devtools(
    persist(
      (set, get) => ({
        admin: null,
        token: null,
        isAdminAuthenticated: false,
        isLoading: true,

        setAdminAuth: (admin, token) => {
          if (token) {
            localStorage.setItem("admin", JSON.stringify(admin));
            localStorage.setItem("adminAccessToken", token);
            set({
              admin,
              token,
              isAdminAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.error("No token provided.");
          }
        },

        setAdmin: (admin) => {
          set({ admin });
        },
        adminLogout: () => {
          console.log("Logging out...");
          localStorage.removeItem("admin");
          localStorage.removeItem("adminAccessToken");
          set({
            admin: null,
            token: null,
            isAdminAuthenticated: false,
            isLoading: false,
          });
        },

        initAdminAuth: async () => {
          const admin = JSON.parse(localStorage.getItem("admin") || "null");
          const token = localStorage.getItem("adminAccessToken");

          if (admin && token && get().checkTokenValidity()) {
            set({ admin, isAdminAuthenticated: true, isLoading: false });
          } else {
            get().adminLogout();
           
          }
        },

        checkTokenValidity: () => {
          const token = localStorage.getItem("adminAccessToken");
         
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
        name: "admin-auth",
      }
    ),

    { name: "AdminAuthStore" }
  )
);

export default useAdminAuthStore;
