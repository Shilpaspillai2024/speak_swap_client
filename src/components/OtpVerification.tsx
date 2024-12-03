
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { sendOtp, verifyOtp } from "@/services/userApi";
import userSignupStore from "@/store/userSignupStore";

interface OtpVerificationProps {
  onNextStep: () => void;
 
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  onNextStep,
 
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]); 
  const [otpSent, setOtpSent] = useState(false);
  const { token } = userSignupStore();
  const [timer, setTimer] = useState(60); 
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0 && interval !== null) {
      clearInterval(interval);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [otpSent, timer]);

  // Function to send OTP
  const handleSendOtp = async () => {
    try {
      await sendOtp(token);
      toast.success("OTP sent successfully!");
      setOtpSent(true);
      setTimer(60); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ token, otp: otp.join("") }); 
      toast.success("OTP verified successfully!");
      onNextStep();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    }
  };

  // Function to handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(0, 1); 
    setOtp(newOtp);
    
   
    if (e.target.value) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Function to focus on the previous input field
  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "") {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  
  const handleResendOtp = () => {
    setOtp(["", "", "", ""]); 
    setTimer(60);
    handleSendOtp();
  };

  return (
    <div className="space-y-6">
   
      {otpSent && (
        <>
          <div className="flex space-x-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-semibold bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="-"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
          >
            Verify OTP
          </button>
        </>
      )}

      {/* Show Send OTP button if OTP has not been sent */}
      {!otpSent && (
        <button
          type="button"
          onClick={handleSendOtp}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
        >
          Send OTP
        </button>
      )}

      {/* Resend OTP link after OTP is sent */}
      {otpSent && timer === 0 && (
        <div className="text-center">
          <button
            onClick={handleResendOtp}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Resend OTP
          </button>
        </div>
      )}

      {/* Show countdown if OTP is sent */}
      {otpSent && timer > 0 && (
        <div className="text-center text-sm text-gray-600">
          Resend OTP in {timer}s
        </div>
      )}

     
    </div>
  );
};

export default OtpVerification;

