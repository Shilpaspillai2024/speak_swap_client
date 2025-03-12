import { useEffect } from "react";
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

    useEffect(() => {
      const checkAuth = async () => {
        await initUserAuth();
        await initTutorAuth();
      };
      checkAuth();
    }, [initUserAuth, initTutorAuth]);

    useEffect(() => {
      if (!isUserLoading && !isTutorLoading && !isUserAuthenticated && !isTutorAuthenticated) {
        router.push("/");
      }
    }, [isUserLoading, isTutorLoading, isUserAuthenticated, isTutorAuthenticated, router]);

    if (isUserLoading || isTutorLoading) {
      return <Loading />;
    }

    if (!isUserAuthenticated && !isTutorAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ClassroomProtectedRoute;
