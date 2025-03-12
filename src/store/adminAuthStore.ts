import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/services/adminApi";
import { logoutAdmin } from "@/services/adminApi";
import { IAdmin } from "@/types/admin";


let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

interface AdminAuthState {
  admin: IAdmin | null;
  token: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  setAdminAuth: (admin: IAdmin, token: string) => void;
  setAdmin: (admin: IAdmin) => void;
  adminLogout: () => void;
  initAdminAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  checkTokenValidity: () => Promise<boolean>;
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
        adminLogout: async () => {
          console.log("Logging out...");
          await logoutAdmin();

          set({
            admin: null,
            token: null,
            isAdminAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem("admin-auth");
        },

        initAdminAuth: async () => {
          const { token, checkTokenValidity, refreshAccessToken, admin } =
            get();
          console.log("Initializing Admin Auth. Current Token:", token);

          if (!token) {
            console.warn("No token found. Logging out...");
            get().adminLogout();
            return;
          }

          const isValid = await checkTokenValidity();

          if (!isValid) {
            const isRefreshed = await refreshAccessToken();
            if (!isRefreshed) {
              get().adminLogout();
              return;
            }
          }

          set({
            admin,
            isAdminAuthenticated: true,
            isLoading: false,
          });
        },

        checkTokenValidity: async () => {
          const { token } = get();
          if (!token) {
            console.warn("Token is missing, user is likely not authenticated.");
            return false;
          }

          try {
            const decodedToken: { exp: number } = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            console.log(
              "Current Time:",
              currentTime,
              "Token Expiry Time:",
              decodedToken.exp
            );
            return decodedToken.exp > currentTime;
          } catch (error) {
            console.error("Error decoding token:", error);
            return false;
          }
        },

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
                  isAdminAuthenticated: true,
                });
                return true;
              }
              return false;
            } catch (error) {
              console.error("Token refresh error:", error);
              get().adminLogout();
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
        name: "admin-auth",
      }
    ),

    { name: "AdminAuthStore" }
  )
);

export default useAdminAuthStore;
