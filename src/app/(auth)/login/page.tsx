"use client";

import Link from "next/link";
import React, { useState,useEffect } from "react";
import { postLogin } from "@/services/userApi";
import { loginSchema } from "@/utils/Validation";
import { LoginErrors } from "@/utils/Types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import userAuthStore from "@/store/userAuthStore";
import Loading from "@/components/Loading";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[error,setErrors]=useState<LoginErrors>({})
  const{isUserAuthenticated,setUserAuth,isLoading}=userAuthStore()
  const router=useRouter();


  useEffect(() => {
    if (isUserAuthenticated) {
      router.push("/dashboard");
    }
  }, [isUserAuthenticated, router]);

  const handleEmailChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setEmail(e.target.value)
    if(error.email){
      setErrors((prevErrors)=>({...prevErrors,email:""}))
    }
  };

  const handlePsswordChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setPassword(e.target.value)
    if(error.password){
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
    const response = await postLogin(email, password);

    if (response) {
      toast.success("login Successfull");
      setUserAuth(response.user, response.accessToken);
      router.push("/dashboard");
    } else {
      toast.error("invalid credentials");
    }
   
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <img
        src="/assets/first_3d.png"
        alt="3D Image"
        className="absolute top-1/4 left-0 transform -translate-y-1/4 w-2/4 h-auto object-contain"
      />

      <div className="max-w-lg w-full space-y-4 ml-52 bg-gradient-to-br from-sky-50 via-emerald-100 to-blue-200 px-4 py-6 rounded-xl shadow-2xl">
        <div>
          <h3 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-md italic">
            Sign in to <span className="italic">Speak Swap</span>
          </h3>
          <p className="text-center mt-2 text-sm text-gray-600">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {error.general && (
            <div className="text-red-500 mb-4">{error.general}</div>
          )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
              />
               <p className="text-red-600 text-xs min-h-[1em]">{error.email}</p>
            </div>

            <div className="mt-4 mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handlePsswordChange}
              />
               <p className="text-red-600 text-xs min-h-[1em]">{error.password}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              
              <Link 
              href="/forgot"
              className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
              >Forgot Password</Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="group relative w-32 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-teal-700 hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
            <div className="flex justify-end w-full mt-4">
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
