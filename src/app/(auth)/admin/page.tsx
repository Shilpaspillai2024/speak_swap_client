"use client";

import React from "react";

const LoginPage = () => {
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

          <form className="space-y-6">
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
                placeholder="Enter your email"
                className="mt-1 block w-full p-3 bg-white bg-opacity-20 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
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
                placeholder="Enter your password"
                className="mt-1 block w-full p-3 bg-white bg-opacity-20 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
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
