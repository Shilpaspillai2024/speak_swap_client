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
    console.log("bookingId",bookingId);

    const {
      isUserAuthenticated,
      isLoading: isUserLoading,
      initAuth: initUserAuth,
      checkTokenValidity: checkUserTokenValidity,
      Logout: userLogout,
    } = userAuthStore();

    console.log("userAuthstore",userAuthStore);
    const {
      isTutorAuthenticated,
      isLoading: isTutorLoading,
      initAuth: initTutorAuth,
      checkTokenValidity: checkTutorTokenValidity,
      Logout: tutorLogout,
    } = tutorAuthStore();

    const { bookingDetails } = useBookingStore();

    console.log("bookingDetails",bookingDetails)

    useEffect(() => {
      const checkAuth = async () => {
        await Promise.all([initUserAuth(), initTutorAuth()]);
      };
      checkAuth();
    }, [initUserAuth, initTutorAuth]);

    useEffect(() => {
      if (
        !isUserLoading &&
        !isTutorLoading &&
        (isUserAuthenticated || isTutorAuthenticated)
      ) {
        if (
          bookingDetails &&
          bookingId &&
          bookingDetails.bookingId !== bookingId
        ) {
          toast.error("Invalid session access");
          router.push(
            isUserAuthenticated ? "/dashboard" : "/tutor/schedules/myschedules"
          );
        }

        if (!bookingDetails && bookingId) {
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
    }, [
      isUserAuthenticated,
      isTutorAuthenticated,
      checkUserTokenValidity,
      checkTutorTokenValidity,
      userLogout,
      tutorLogout,
      router,
    ]);

    useEffect(() => {
      if (
        !isUserLoading &&
        !isTutorLoading &&
        !isUserAuthenticated &&
        !isTutorAuthenticated
      ) {
        toast.error("Please login to access the classroom");
        router.push("/");
      }
    }, [
      isUserLoading,
      isTutorLoading,
      isUserAuthenticated,
      isTutorAuthenticated,
      router,
    ]);

    if (isUserLoading || isTutorLoading) {
      return <Loading />;
    }

    if (!isUserAuthenticated && !isTutorAuthenticated) {
      return null;
    }

    if (
      !bookingDetails ||
      !bookingDetails.bookingId ||
      bookingDetails.bookingId !== bookingId
    ) {
      toast.error("Invalid classroom access");
      setTimeout(() => {
        router.push(
          isUserAuthenticated ? "/dashboard" : "/tutor/schedules/myschedules"
        );
      }, 1000);
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ClassroomProtectedRoute;
