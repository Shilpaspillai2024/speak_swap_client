import { useEffect } from "react";
import { useRouter } from "next/navigation";
import tutorAuthStore from "@/store/tutorAuthStore";
import Loading from "@/components/Loading";

const TutorProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  return function ProtectedComponent(props: any) {
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
          Logout();
          router.push("/tutor/login");
        }
      }, 60000); 

      return () => clearInterval(tokenCheckInterval);
    }, [checkTokenValidity, Logout, router]);



    useEffect(() => {
      if (!isLoading && !isTutorAuthenticated) {
        router.push("/tutor/login");
      }
    }, [isLoading, isTutorAuthenticated, router]);

    if (isLoading) {
      return <Loading />;
    }

   
    if (!isTutorAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default TutorProtectedRoute;
