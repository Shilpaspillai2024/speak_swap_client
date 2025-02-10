import { useEffect } from "react";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userAuthStore";
import Loading from "@/components/Loading";

const UserProtectedRoute =<P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function ProtectedComponent(props:P) {
    const {
      isUserAuthenticated,
      isLoading,
      initAuth,
      Logout,
      checkTokenValidity,
    } = userAuthStore();

    
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
          router.push("/");
        }
      }, 60000); 

      return () => clearInterval(tokenCheckInterval);
    }, [checkTokenValidity, Logout, router]);



    useEffect(() => {
      if (!isLoading && !isUserAuthenticated) {
        router.push("/");
      }
    }, [isLoading, isUserAuthenticated, router]);

    if (isLoading) {
      return <Loading />;
    }

    
    if (!isUserAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default UserProtectedRoute;
