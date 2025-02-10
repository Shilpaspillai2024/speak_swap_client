import { useEffect } from "react";
import { useRouter } from "next/navigation";
import tutorAuthStore from "@/store/tutorAuthStore";
import Loading from "@/components/Loading";

const TutorProtectedRoute =<P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function ProtectedComponent(props:P) {
    const {
      isTutorAuthenticated,
      isLoading,
      initAuth,
      Logout,
      checkTokenValidity,
    } = tutorAuthStore();

    
    const router = useRouter();



    useEffect(() => {
      const checkAuth = async () => {
        await initAuth();
      };
      checkAuth();
    }, [initAuth]);



    
    useEffect(() => {
      const tokenCheckInterval = setInterval(() => {
        if (!checkTokenValidity()) {
          console.log("Token is expired or invalid")
          Logout();
          router.push("/tutor")
        }
      }, 60000); 

      return () => clearInterval(tokenCheckInterval);
    }, [checkTokenValidity, Logout, router]);



    useEffect(() => {
      if (!isLoading && !isTutorAuthenticated) {
        router.push("/tutor");
      }
    }, [isLoading, isTutorAuthenticated, router]);

    if (isLoading) return <Loading />;
    

   
    if (!isTutorAuthenticated) return null; 
    

    return <WrappedComponent {...props} />;
  };
};

export default TutorProtectedRoute;
