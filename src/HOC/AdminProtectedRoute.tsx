import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdminAuthStore from "@/store/adminAuthStore";
import Loading from "@/components/Loading";

const protectedRoute = (WrappedComponent: React.ComponentType<any>) => {
  return function ProtectedComponent(props: any) {
    const {
      isAdminAuthenticated,
      isLoading,
      initAdminAuth,
      adminLogout,
      checkTokenValidity,
    } = useAdminAuthStore();

    
    const router = useRouter();



    useEffect(() => {
      const checkAuth = async () => {
        await initAdminAuth();
      };
      checkAuth();
    }, [initAdminAuth]);



    // Token validity check interval
    useEffect(() => {
      const tokenCheckInterval = setInterval(() => {
        if (!checkTokenValidity()) {
          adminLogout();
          router.push("/admin");
        }
      }, 60000); // Check every minute

      return () => clearInterval(tokenCheckInterval);
    }, [checkTokenValidity, adminLogout, router]);



    useEffect(() => {
      if (!isLoading && !isAdminAuthenticated) {
        router.push("/admin");
      }
    }, [isLoading, isAdminAuthenticated, router]);

    if (isLoading) {
      return <Loading />;
    }

    // Only render wrapped component if authenticated
    if (!isAdminAuthenticated) {
      return null; // Prevent rendering until authentication is confirmed
    }

    return <WrappedComponent {...props} />;
  };
};

export default protectedRoute;
