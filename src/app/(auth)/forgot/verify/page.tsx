"use client";
import React, { useState, useEffect } from "react";
import { forgotPassword, verifyForgotOtp } from "@/services/userApi";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";

const VerifyOtp = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem("otpTimer");
    const savedTime = localStorage.getItem("otpTime");
    
   
    if (!savedTimer || !savedTime) {
      localStorage.setItem("otpTimer", "60");
      localStorage.setItem("otpTime", Math.floor(Date.now() / 1000).toString());
      return 60;
    }
    
   
    const remainingTime = Number(savedTimer);
    const startTime = Number(savedTime);
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedTime = currentTime - startTime;
    
    return remainingTime > elapsedTime ? remainingTime - elapsedTime : 0;
  });

  const router = useRouter();

  useEffect(() => {
    if (timer === 0) {
      localStorage.removeItem("otpTimer");
      localStorage.removeItem("otpTime");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          const newTimer = prev - 1;
          localStorage.setItem("otpTimer", newTimer.toString());
          return newTimer;
        }
        clearInterval(interval);
        localStorage.removeItem("otpTimer");
        localStorage.removeItem("otpTime");
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 4) {
      setMessage("Please enter a valid 4-digit OTP");
      return;
    }
    if (!email) {
      toast.error("Email is missing. Please refresh the page and try again.");
      return;
    }
    try {
      await verifyForgotOtp(email, fullOtp);
      setIsOtpVerified(true);
      router.push(`/forgot/resetpassword?email=${encodeURIComponent(email)}`);
      toast.success("OTP verified successfully");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not available for resending OTP.");
      return;
    }
    try {
      await forgotPassword(email);
      setOtp(["", "", "", ""]);
      setTimer(60);
      localStorage.setItem("otpTimer", "60");
      localStorage.setItem('otpTime', Math.floor(Date.now() / 1000).toString());
      toast.info("OTP resent to your email");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="bg-gradient-to-br from-sky-50 via-emerald-100 to-blue-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>
        {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleVerifyOtp}>
          <div className="flex gap-2 mb-4 justify-center">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index)}
                className="w-12 h-12 text-center border rounded"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full text-white bg-teal-700 hover:bg-teal-900 py-2 rounded"
          >
            Verify OTP
          </button>
        </form>

      
        <div className="mt-4 text-center">
          {timer > 0 ? (
            <div className="flex flex-col items-center space-y-2">
              
              <div className="text-2xl font-bold text-teal-700">
                {formatTime(timer)}
              </div>
            </div>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-teal-700 hover:text-teal-900 font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

        {isOtpVerified && (
          <div className="mt-4">
            <a
              href="/forgot/resetpassword"
              className="text-teal-700 text-xl hover:text-teal-900"
            >
              Click here to reset your password
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;