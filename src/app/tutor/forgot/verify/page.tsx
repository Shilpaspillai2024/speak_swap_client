'use client';
import React, { useState, useEffect } from 'react';
import { forgotPassword,verifyForgotOtp } from '@/services/tutorApi';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';

const VerifyOtp = () => {
  const searchParams=useSearchParams()
  const email=searchParams.get("email")
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);

const router=useRouter()


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setMessage('Please enter a valid 4-digit OTP');
      return;
    }
    if (!email) {
      toast.error('Email is missing. Please refresh the page and try again.');
      return;
    }
    try {
      await verifyForgotOtp(email,fullOtp);
      setIsOtpVerified(true);
      router.push(`/tutor/forgot/resetpassword?email=${encodeURIComponent(email)}`)
      toast.success('OTP verified successfully');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async() => {
    if (!email) {
      toast.error('Email not available for resending OTP.');
      return;
    }
    try {
      await  forgotPassword(email)
      setOtp(["", "", "", ""]);
      setTimer(60);
      toast.info('OTP resent to your email');
      
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again later.');
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
        {timer > 0 ? (
          <p className="mt-4 text-gray-600">Resend OTP in {timer}s</p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="mt-4 text-teal-700 hover:text-teal-900"
          >
            Resend OTP
          </button>
        )}
        {isOtpVerified && (
          <div className="mt-4">
            <a
              href="/forgot/resetpassword"
              className="text-teal-700 hover:text-teal-900"
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
