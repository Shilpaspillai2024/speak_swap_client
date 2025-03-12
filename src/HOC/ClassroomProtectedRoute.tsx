import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userAuthStore";
import tutorAuthStore from "@/store/tutorAuthStore";
import Loading from "@/components/Loading";

const ClassroomProtectedRoute = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function ProtectedComponent(props: P) {
    const {
      isUserAuthenticated,
      isLoading: isUserLoading,
      initAuth: initUserAuth,
    } = userAuthStore();

    const {
      isTutorAuthenticated,
      isLoading: isTutorLoading,
      initAuth: initTutorAuth,
    } = tutorAuthStore();

    const router = useRouter();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        await initUserAuth();
        await initTutorAuth();
        setHasCheckedAuth(true);
      };

      if (!hasCheckedAuth) {
        checkAuth();
      }
    }, [hasCheckedAuth, initUserAuth, initTutorAuth]);

    useEffect(() => {
      if (hasCheckedAuth && !isUserLoading && !isTutorLoading && !isUserAuthenticated && !isTutorAuthenticated) {
        router.push("/");
      }
    }, [hasCheckedAuth, isUserLoading, isTutorLoading, isUserAuthenticated, isTutorAuthenticated, router]);

    if (!hasCheckedAuth || isUserLoading || isTutorLoading) {
      return <Loading />;
    }

    if (!isUserAuthenticated && !isTutorAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ClassroomProtectedRoute;

