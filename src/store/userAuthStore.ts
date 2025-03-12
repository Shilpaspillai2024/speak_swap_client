import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { refreshToken, logoutUser } from "@/services/userApi";
import { IUser } from "@/types/user";

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

interface UserAuthState {
  user: IUser | null;
  token: string | null;
  isUserAuthenticated: boolean;
  isLoading: boolean;
  setUserAuth: (user: IUser, token: string) => void;
  setUser: (user: IUser) => void;
  Logout: () => void;
  initAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  checkTokenValidity: () => Promise<boolean>;
}

interface DecodedToken {
  exp: number;
  iat: number;
  userId: string;
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
            console.log("setting user:", { user, token });
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
        Logout: async () => {
          console.log("Logging out...");
          await logoutUser();

          set({
            user: null,
            token: null,
            isUserAuthenticated: false,
            isLoading: false,
          });

          localStorage.removeItem("user-auth");
        },

        initAuth: async () => {
          const {
            token,
            checkTokenValidity,
            refreshAccessToken,
            user,
            Logout,
          } = get();
          console.log("Initializing user Auth. Current Token:", token);

          if (!token) {
            console.warn("No token found.Logging out....");
            Logout();
            return;
          }

          const isValid = await checkTokenValidity();
          if (!isValid) {
            const isRefreshed = await refreshAccessToken();
            if (!isRefreshed) {
              Logout();
              return;
            }
          }
          set({
            user,
            isUserAuthenticated: true,
            isLoading: false,
          });
        },

        checkTokenValidity: async () => {
          const { token } = get();

          if (!token) {
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

        // refreshAccessToken: async () => {
        //   try {
        //     const data = await refreshToken();
        //     if (data?.accessToken) {
        //       set({ token: data.accessToken, isUserAuthenticated: true });
        //       return true;
        //     }
        //     return false;
        //   } catch (error) {
        //     console.error("Token refresh error:", error);
        //     get().Logout();
        //     return false;
        //   }
        // },

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
                  isUserAuthenticated: true,
                });
                return true;
              }
              return false;
            } catch (error) {
              console.error("Token refresh error:", error);
              get().Logout();
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
        name: "user-auth",
      }
    ),

    { name: "UserAuthStore" }
  )
);

export default userAuthStore;
