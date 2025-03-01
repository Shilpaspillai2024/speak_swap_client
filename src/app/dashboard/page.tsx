"use client";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";
import UserNavbar from "@/components/UserNavbar";
import { fetchUsers } from "@/services/userApi";
import { toast } from "react-toastify";
import userAuthStore from "@/store/userAuthStore";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IUser } from "@/types/user";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import socketStore from "@/store/socketStore";
import { debounce } from "lodash";
import { HttpStatus } from "@/constants/httpStatus";

const UserDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isLoading, isUserAuthenticated, Logout, user } = userAuthStore();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const socket = socketStore.getState().socket;
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);
  const USERS_PER_PAGE = 6;

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchQuery(value);
      setPage(1);
      setUsers([]);
    }, 500)
  ).current;

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("Fetching next page:", page + 1);
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadUsers = async () => {
      if (loading) return;

      try {
        setLoading(true);
        const data = await fetchUsers(page, USERS_PER_PAGE, searchQuery);
        console.log("users data", data);

        const uniqueData = Array.from(
          new Map(data.map((user: IUser) => [user._id, user])).values()
        );

        if (page === 1) {
          setUsers(uniqueData);
        } else {
          setUsers((prevUsers) => {
            const combinedUsers = [...prevUsers, ...uniqueData];
            return Array.from(
              new Map(
                combinedUsers.map((user: IUser) => [user._id, user])
              ).values()
            );
          });
        }

        setHasMore(data.length === USERS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching users:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === HttpStatus.UNAUTHORIZED) {
            toast.error("Unauthorized access. Please log in again.");
            Logout();
            router.push("/login");
          } else if (error.response?.status === HttpStatus.FORBIDDEN) {
            toast.error("You are not allowed to access this resource.");
          } else {
            toast.error("An unexpected error occurred.");
          }
        } else {
          toast.error("An error occurred while fetching users.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page, searchQuery, Logout, router]);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("userOnline", user._id);
    }

    if (socket) {
      socket.on("updateUserStatus", ({ userId, isOnline }) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? { ...u, isOnline } : u))
        );
      });

      return () => {
        socket.off("updateUserStatus");
      };
    }
  }, [socket, user]);

  if (isLoading) return <Loading />;
  if (!isUserAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <UserNavbar />

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4 p-4">
        <div className="relative w-full sm:w-1/3">
          <div className="relative">
            <input
              type="text"
              defaultValue={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              placeholder="Search by native language..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Display Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {users.length === 0 && !loading ? (
          <p className="col-span-full text-center text-gray-500">
            No users found with the selected language.
          </p>
        ) : (
          users.map((user, index) => (
            <Link href={`/user/profile/${user._id}`} key={user._id}>
              <div
                ref={index === users.length - 1 ? lastUserElementRef : null}
                className="flex bg-white shadow-md rounded-2xl border border-gray-200 p-4"
              >
                <Image
                  src={user.profilePhoto}
                  alt={user.fullName}
                  width={64}
                  height={64}
                  quality={100}
                  unoptimized
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user.fullName}
                    </h2>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          user.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <p className="text-sm text-gray-500">
                        {user.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Country:</strong> {user.country}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Known:</strong> {user.knownLanguages.join(", ")}
                  </p>

                  <div className="flex justify-between mt-2">
                    <p className="text-sm">
                      <strong>Native:</strong> {user.nativeLanguage}
                    </p>
                    <p className="text-sm">
                      <strong>Learning:</strong> {user.learnLanguage}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {loading && (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-2 text-gray-500">Loading more users...</p>
        </div>
      )}
    </div>
  );
};

export default UserProtectedRoute(UserDashboard);
