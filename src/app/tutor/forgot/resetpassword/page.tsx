'use client'
import { resetPassword } from '@/services/tutorApi';
import React, { useState,Suspense} from 'react'
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { passwordSetErrors } from '@/utils/Types';
import { resetpasswordSetupSchema } from '@/utils/Validation';


const ResetPasswordForm = () => {
  const searchParams=useSearchParams()
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<passwordSetErrors>({})
  const email = searchParams.get('email');;
  const router=useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is missing. Please refresh the page and try again.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({general:"Passwords don't match. Please try again."});
      return;
    }
    setErrors({})


    const validationResult = resetpasswordSetupSchema.safeParse({
      newPassword,
      confirmPassword,
    })

    if (!validationResult.success) {
      const newErrors: passwordSetErrors = {}

      validationResult.error.errors.forEach((err) => {
        newErrors[err.path[0] as keyof passwordSetErrors] = err.message
      })

      setErrors(newErrors)
      return
    }
    try {
      await resetPassword(email,newPassword,confirmPassword)
      toast.success("passsword rest successfully")
      router.push("/tutor/login")
      
    } catch (error) {
      toast.error(" something went wrong try again")
      console.error("something sent wrong",error)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="bg-gradient-to-br from-sky-50 via-emerald-100 to-blue-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        {errors.general && <p className="text-red-500 text-xs sm:text-sm mb-4">{errors.general}</p>}
        <form onSubmit={handleResetPassword}>
          <label htmlFor="new-password" className="block text-sm font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          />
            {errors.newPassword && (
                <p className="mt-1 text-red-500 text-xs sm:text-sm">{errors.newPassword}</p>
              )}
          <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          />
           {errors.confirmPassword && (
                <p className="mt-1 text-red-500 text-xs sm:text-sm">{errors.confirmPassword}</p>
              )}
          <button
            type="submit"
            className="w-full text-white bg-teal-700 hover:bg-teal-900 py-2 rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPassword;
