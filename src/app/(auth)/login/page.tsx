"use client";

import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { role, email, password });
  };

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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />

          <div className="rounded-md shadow-sm -space-y-px">
            {/* Role Selection */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Select Role
              </label>
              <select
                id="role"
                name="role"
                required
                className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Tutor</option>
              </select>
            </div>

            
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
                onChange={(e) => setEmail(e.target.value)}
              />
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot_password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
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
