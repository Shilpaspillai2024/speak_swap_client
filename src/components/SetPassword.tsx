"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { setPassword as sendUserPassword} from "@/services/userApi";
import { setPassword as sendTutorPassword } from "@/services/tutorApi";
import { signupValidationSchema } from "@/utils/Validation";
import { userSignupStore,tutorSignupStore } from "@/store/userSignupStore";
import { z } from "zod";

interface SetPasswordProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  role:"user" |"tutor";
}

const SetPassword: React.FC<SetPasswordProps> = ({
  onNextStep,
  onPrevStep,
  role
}) => {
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = role === "user" ? userSignupStore() : tutorSignupStore();
  const setPassword = role === "user" ? sendUserPassword : sendTutorPassword;

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const validationPassword = {
        password,
        confirmPassword,
      };
      signupValidationSchema.shape.passwordSetupSchema.parse(
        validationPassword
      );

      await setPassword({ token, password, confirmPassword });
      toast.success("Password set successfully!");
      onNextStep();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0]?.message || "Failed to set password.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
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
          name="password"
          value={password}
          onChange={(e) => setPasswordState(e.target.value)}
          placeholder="Enter your password"
          className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      <button
        type="button"
        onClick={handleSetPassword}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
      >
        Set Password
      </button>

      <button
        type="button"
        onClick={onPrevStep}
        className="w-full bg-gray-300 text-gray-700 py-3 rounded-3xl font-medium hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
};

export default SetPassword;
