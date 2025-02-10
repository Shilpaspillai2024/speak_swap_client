"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  const handleRedirect = () => {
    
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-customBlue mb-4">
          {`Registration Successful!`}
        </h1>
        <p className="text-xl text-customBlue mb-6">
          {`Welcome to Speak Swap! Continue your journey by logging in.`}
        </p>

        <button
          onClick={handleRedirect}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-6 text-lg rounded-3xl"
        >
          {`Go to Login`}
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
