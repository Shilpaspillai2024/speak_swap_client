import { useEffect } from "react";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userAuthStore";
import Loading from "@/components/Loading";

const UserProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  return function ProtectedComponent(props: any) {
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



    // Token validity check interval
    useEffect(() => {
      const tokenCheckInterval = setInterval(() => {
        if (!checkTokenValidity()) {
          Logout();
          router.push("/login");
        }
      }, 60000); // Check every minute

      return () => clearInterval(tokenCheckInterval);
    }, [checkTokenValidity, Logout, router]);



    useEffect(() => {
      if (!isLoading && !isUserAuthenticated) {
        router.push("/login");
      }
    }, [isLoading, isUserAuthenticated, router]);

    if (isLoading) {
      return <Loading />;
    }

    // Only render wrapped component if authenticated
    if (!isUserAuthenticated) {
      return null; // Prevent rendering until authentication is confirmed
    }

    return <WrappedComponent {...props} />;
  };
};

export default UserProtectedRoute;
