'use client';

import React, { useState } from 'react';

const LoginPage = () => {
  const [role, setRole] = useState('user'); // Default selected role

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 ">
     
      <div className="flex w-full max-w-5xl bg-white bg-opacity-30 backdrop-blur-lg shadow-2xl overflow-hidden rounded-3xl">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome to SpeakSwap</h1>
            <p className="mt-4 text-sm text-gray-200">
              "Empowering conversations, one connection at a time."
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">
              &copy; 2024 SpeakSwap. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            SignIn to continue
          </h2>

          {/* Role Selection */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="user">User</option>
              <option value="tutor">Tutor</option>
             
            </select>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
            >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>


          <button
            className="w-full flex items-center justify-center bg-white bg-opacity-80 border border-gray-300 rounded-full py-3 mt-4 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-purple-500"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Icon"
              className="h-6 w-6 mr-2"
            />
            SignIn with Google
          </button>

          {/* Forgot Password & Registration */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <button className="text-indigo-500 hover:underline">Forgot Password?</button>
            <p className="text-gray-500">
              New here?{' '}
              <button className="text-purple-500 hover:underline">Register</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
