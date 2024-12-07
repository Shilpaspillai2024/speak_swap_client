'use client'
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

   
    console.log("forgot")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="bg-gradient-to-br from-sky-50 via-emerald-100 to-blue-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        {message && <p className="text-sm text-green-500 mb-4">{message}</p>}
        <form onSubmit={handleForgotPassword}>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Enter your email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          />
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
