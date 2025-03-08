import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import userAuthStore from "@/store/userAuthStore";
import tutorAuthStore from "@/store/tutorAuthStore";
import { useBookingStore } from "@/store/bookingStore";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";

const ClassroomProtectedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const params = useParams();
    const bookingId = params?.bookingId;

    const {
      isUserAuthenticated,
      isLoading: isUserLoading,
      initAuth: initUserAuth,
      checkTokenValidity: checkUserTokenValidity,
      Logout: userLogout,
    } = userAuthStore();

    const {
      isTutorAuthenticated,
      isLoading: isTutorLoading,
      initAuth: initTutorAuth,
      checkTokenValidity: checkTutorTokenValidity,
      Logout: tutorLogout,
    } = tutorAuthStore();

    const { bookingDetails } = useBookingStore();

    useEffect(() => {
      const checkAuth = async () => {
        await Promise.all([initUserAuth(), initTutorAuth()]);
      };
      checkAuth();
    }, [initUserAuth, initTutorAuth]);

    useEffect(() => {
      if (!isUserLoading && !isTutorLoading) {
      
        if (!isUserAuthenticated && !isTutorAuthenticated) {
          toast.error("Please login to access the classroom");
          router.push("/");
          return;
        }

        
        if (bookingDetails && bookingId) {
          if (bookingDetails.bookingId !== bookingId) {
            toast.error("Invalid session access");
            router.push(
              isUserAuthenticated ? "/dashboard" : "/tutor/schedules/myschedules"
            );
          }
        } else {
          toast.error("No session details found");
          router.push(
            isUserAuthenticated ? "/dashboard" : "/tutor/schedules/myschedules"
          );
        }
      }
    }, [
      bookingId,
      bookingDetails,
      isUserLoading,
      isTutorLoading,
      isUserAuthenticated,
      isTutorAuthenticated,
      router,
    ]);

    useEffect(() => {
      if (isUserAuthenticated || isTutorAuthenticated) {
        const tokenCheckInterval = setInterval(() => {
          if (isUserAuthenticated && !checkUserTokenValidity()) {
            userLogout();
            router.push("/");
          }
          if (isTutorAuthenticated && !checkTutorTokenValidity()) {
            tutorLogout();
            router.push("/tutor");
          }
        }, 60000);

        return () => clearInterval(tokenCheckInterval);
      }
    }, [
      isUserAuthenticated,
      isTutorAuthenticated,
      checkUserTokenValidity,
      checkTutorTokenValidity,
      userLogout,
      tutorLogout,
      router,
    ]);

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
