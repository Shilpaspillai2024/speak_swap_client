import { useEffect } from "react";
import { useRouter } from "next/navigation";
import tutorAuthStore from "@/store/tutorAuthStore";
import userAuthStore from "@/store/userAuthStore";
import Loading from "@/components/Loading";

const ClassroomProtectedRoute = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function ProtectedComponent(props: P) {
    const {
      isTutorAuthenticated,
      isLoading: isTutorLoading,
      initAuth: initTutorAuth,
      Logout: tutorLogout,
      checkTokenValidity: checkTutorTokenValidity,
    } = tutorAuthStore();

    console.log("tutorAuthStore",tutorAuthStore)

    const {
      isUserAuthenticated,
      isLoading: isUserLoading,
      initAuth: initUserAuth,
      Logout: userLogout,
      checkTokenValidity: checkUserTokenValidity,
    } = userAuthStore();

    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        await Promise.all([initTutorAuth(), initUserAuth()]);
      };
      checkAuth();
    }, [initTutorAuth, initUserAuth]);

   
    useEffect(() => {
      const tokenCheckInterval = setInterval(() => {
        if (isTutorAuthenticated && !checkTutorTokenValidity()) {
          console.log("Tutor token is expired or invalid");
          tutorLogout();
          router.push("/tutor");
        } else if (isUserAuthenticated && !checkUserTokenValidity()) {
          console.log("User token is expired or invalid");
          userLogout();
          router.push("/");
        }
      }, 60000);

      return () => clearInterval(tokenCheckInterval);
    }, [
      isTutorAuthenticated, 
      isUserAuthenticated, 
      checkTutorTokenValidity, 
      checkUserTokenValidity, 
      tutorLogout, 
      userLogout, 
      router
    ]);

    
    useEffect(() => {
      const isLoading = isTutorLoading || isUserLoading;
      const isAuthenticated = isTutorAuthenticated || isUserAuthenticated;
      
      if (!isLoading && !isAuthenticated) {
        router.push("/");
      }
    }, [isTutorLoading, isUserLoading, isTutorAuthenticated, isUserAuthenticated, router]);

    
    if (isTutorLoading || isUserLoading) {
      return <Loading />;
    }

   
    if (isTutorAuthenticated || isUserAuthenticated) {
      return <WrappedComponent {...props} />;
    }

   
    return null;
  };
};

export default ClassroomProtectedRoute;
