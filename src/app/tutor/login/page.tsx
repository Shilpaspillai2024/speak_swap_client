"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import tutorAuthStore from "@/store/tutorAuthStore";
import { loginSchema } from "@/utils/Validation";
import { LoginErrors } from "@/utils/Types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { tutorLogin } from "@/services/tutorApi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState<LoginErrors>({});
  const { isTutorAuthenticated, setTutorAuth } = tutorAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isTutorAuthenticated) {
      router.push("/tutor/dashboard");
    }
  }, [isTutorAuthenticated, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const handlePsswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

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
    }

    const response = await tutorLogin(email, password);
    if (response) {
      toast.success("Login Successful");
      setTutorAuth(response.tutor, response.accessToken);
      router.push("/tutor/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-blue-50 relative">
    <div className="absolute top-0 left-0 w-full h-full bg-tutor-pattern opacity-10 z-[-1]"></div>
  
    <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-md z-10">
      <h2 className="text-center text-3xl font-bold text-gray-700 mb-4">
        Welcome Back, Tutor!
      </h2>
      <p className="text-center text-sm text-gray-500">
        Please sign in to access your dashboard.
      </p>
      {error.general && (
        <p className="text-center text-red-500 mt-2">{error.general}</p>
      )}
      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          {error.email && (
            <p className="text-red-500 text-xs mt-1">{error.email}</p>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePsswordChange}
            className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          {error.password && (
            <p className="text-red-500 text-xs mt-1">{error.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full mt-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 shadow-md"
        >
          Login
        </button>
      </form>
      <div className="mt-6 flex justify-between items-center">
        <Link
          href="/tutor/forgot"
          className="text-sm text-teal-500 hover:underline"
        >
          Forgot Password?
        </Link>
        <Link
          href="/tutor/signup"
          className="text-sm text-teal-500 hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  </div>
  
  );
};

export default LoginPage;
