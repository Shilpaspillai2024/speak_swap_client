"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/services/adminApi";
import useAdminAuthStore from "@/store/adminAuthStore";
import Loading from "@/components/Loading";
import { loginSchema } from "@/utils/Validation";
import { LoginErrors } from "@/utils/Types";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const { isAdminAuthenticated, setAdminAuth, isLoading } = useAdminAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAdminAuthenticated, router]);



  const handleEmailChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      setEmail(e.target.value)
      if(errors.email){
        setErrors((prevErrors)=>({...prevErrors,email:""}))
      }
   }

  const handlePasswordChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
       setPassword(e.target.value)
       if(errors.password){
        setErrors((prevErrors)=>({...prevErrors,password:""}))
       }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrors({ general: "All fields must be filled" });
      return;
    }

    setErrors({});

    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    } else {
      setErrors({});
    }
   
      const response = await loginAdmin(email, password);

      if (response) {
        toast.success("login Successfull");
        setAdminAuth(response.isAdmin, response.accessToken);
        router.push("/admin/dashboard");
      } else {
        toast.error("invalid credentials");
      }
    
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

  // if (isAdminAuthenticated) {
  //   return null;
  // }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="flex w-full max-w-5xl bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl overflow-hidden rounded-3xl">
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome to SpeakSwap</h1>
            <p className="mt-4 text-sm text-gray-300">
              "Empowering conversations, one connection at a time."
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">
              &copy; 2024 SpeakSwap. All rights reserved.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-[#A7C7E7] to-[#D1A7E5] text-white">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Admin Panel Login
          </h2>

          {errors.general && (
            <div className="text-red-500 mb-4">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                username
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="mt-1 block w-full p-3 bg-white text-black bg-opacity-20 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <p className="text-red-600 text-xs min-h-[1em]">{errors.email}</p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className="mt-1 block w-full p-3 bg-white text-black bg-opacity-20 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <p className="text-red-600 text-xs min-h-[1em]">
                {errors.password}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4F4F7F] to-[#3D3D5C] text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
