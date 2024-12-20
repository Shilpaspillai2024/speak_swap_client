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
      const checkAuthAndToken = async () => {
        await initAdminAuth();
        const isTokenValid=await checkTokenValidity();
        if(!isTokenValid){
          adminLogout()
          router.push("/admin")
        }
      }
      checkAuthAndToken();

      },[initAdminAuth, checkTokenValidity, adminLogout, router])

   


    useEffect(() => {
      if (!isLoading && !isAdminAuthenticated) {
        router.push("/admin");
      }
    }, [isLoading, isAdminAuthenticated, router]);

    if (isLoading) {
      return <Loading />;
    }

    
    if (!isAdminAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default protectedRoute;
