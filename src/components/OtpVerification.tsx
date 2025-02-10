"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  sendOtp as sendUserOtp,
  verifyOtp as verifyUserOtp,
} from "@/services/userApi";
import {
  sendOtp as sendTutorOtp,
  verifyOtp as verifyTutorOtp,
} from "@/services/tutorApi";

import { userSignupStore, tutorSignupStore } from "@/store/userSignupStore";

interface OtpVerificationProps {
  onNextStep: () => void;
  role: "user" | "tutor";
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  onNextStep,
  role,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const { token } = role === "user" ? userSignupStore() : tutorSignupStore();

  const sendOtp = role === "user" ? sendUserOtp : sendTutorOtp;
  const verifyOtp = role === "user" ? verifyUserOtp : verifyTutorOtp;

  useEffect(() => {
    const savedOtpTime = localStorage.getItem("otpTimestamp");
    const savedOtpTimer = localStorage.getItem("otpTimer");

    console.log("Saved OTP Timestamp:", savedOtpTime);
    console.log("Saved OTP Timer:", savedOtpTimer);

    if (savedOtpTime) {
      const elapsedTime = Math.floor(
        (Date.now() - Number(savedOtpTime)) / 1000
      );
      const remainingTime = 60 - elapsedTime;
      console.log(
        "Elapsed Time:",
        elapsedTime,
        "Remaining Time:",
        remainingTime
      );
      if (remainingTime > 0) {
        setOtpSent(true);
        setTimer(remainingTime);
        localStorage.setItem("otpTimer", remainingTime.toString());
      } else {
        localStorage.removeItem("otpTimestamp");
        localStorage.removeItem("otpTimer");
        setOtpSent(false);
        setTimer(0);
      }
    } else if (savedOtpTimer) {
      console.log("Using saved timer value from localStorage:", savedOtpTimer);
      setOtpSent(true);
      setTimer(Number(savedOtpTimer));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer <= 0) {
            clearInterval(interval!);
            localStorage.removeItem("otpTimestamp");
            localStorage.removeItem("otpTimer");
          } else {
            localStorage.setItem("otpTimer", newTimer.toString());
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
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
      localStorage.setItem("otpTimestamp", Date.now().toString());
      localStorage.setItem("otpTimer", "60");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data: { message: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Failed to send otp."
        );
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ token, otp: otp.join("") });
      toast.success("OTP verified successfully!");

      localStorage.removeItem("otpTimestamp");
      localStorage.removeItem("otpTimer");
      onNextStep();
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data: { message: string } };
        };
        toast.error(axiosError.response?.data?.message || "Invalid OTP.");
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(0, 1);
    setOtp(newOtp);

    if (e.target.value) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    localStorage.removeItem("otpTimestamp");
    localStorage.removeItem("otpTimer");
    setOtp(["", "", "", ""]);

    // setTimer(60);
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
