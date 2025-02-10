"use client";
import { forgotPassword } from "@/services/userApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "email is required" });
      return;
    }else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Invalid email format" }); 
      return;
    }
    setErrors({});

    try {
      const response = await forgotPassword(email);
      if (response) {
        toast.success("OTP sent to your email");
        router.push(`/forgot/verify?email=${encodeURIComponent(email)}`);
        
      }
    } catch (error: unknown) {
      // Improved error handling
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="bg-gradient-to-br from-sky-50 via-emerald-100 to-blue-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
       
        <form onSubmit={handleForgotPassword}>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Enter your email address
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value);setErrors({})}}
            required
            className={`w-full p-2 border rounded mb-1 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
            {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
          <button
            type="submit"
            className="w-full text-white bg-teal-700 hover:bg-teal-900  py-2 rounded"
          >
            Send Otp
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
