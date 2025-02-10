import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode"
import { refreshToken } from "@/services/userApi";
import { IUser } from "@/types/user";

interface UserAuthState {
  user: IUser | null;
  token: string | null;
  isUserAuthenticated: boolean;
  isLoading: boolean;
  setUserAuth: (user: IUser, token: string) => void;
  setUser: (user: IUser) => void;
  Logout: () => void;
  initAuth: () => Promise<void>;
  refreshAccessToken:()=>Promise<boolean>
  checkTokenValidity: () =>Promise<boolean>;
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
          console.log("setting user:",{user,token});
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
          
          set({
            user: null,
            token: null,
            isUserAuthenticated: false,
            isLoading: false,
          });
        },

        initAuth: async () => {
        const{token,checkTokenValidity,refreshAccessToken,user}=get();
        console.log("Initializing user Auth. Current Token:", token);


        if(!token){
          console.warn("No token found.Logging out....");
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
            user,
            isUserAuthenticated:true,
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
           // const decodedToken: any = jwtDecode(token);

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
                isUserAuthenticated:true
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
        name: "user-auth",
      }
    ),

    { name: "UserAuthStore" }
  )
);

export default userAuthStore;
