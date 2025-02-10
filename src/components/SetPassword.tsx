"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { setPassword as sendUserPassword} from "@/services/userApi";
import { setPassword as sendTutorPassword } from "@/services/tutorApi";
import { signupValidationSchema } from "@/utils/Validation";
import { userSignupStore,tutorSignupStore } from "@/store/userSignupStore";
import { z } from "zod";
import { passwordErrors } from "@/utils/Types";

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
  const [errorMessage, setErrorMessage] = useState<passwordErrors>({});
  const { token } = role === "user" ? userSignupStore() : tutorSignupStore();
  const setPassword = role === "user" ? sendUserPassword : sendTutorPassword;

  const handleSetPassword = async () => {

    setErrorMessage({})
    if (password !== confirmPassword) {
      setErrorMessage({general:"Passwords do not match."});
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
    } catch (error:unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrorMessage({
          password: fieldErrors.password?.[0] || "",
          confirmPassword: fieldErrors.confirmPassword?.[0] || "",
          general: "",
        });
      } else {
        setErrorMessage({ general: "An unexpected error occurred." });
      }
      toast.error("please correct the errors");
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
          onChange={(e) => {setPasswordState(e.target.value);if (errorMessage.password)
            setErrorMessage({ ...errorMessage, password: "" });}}
          placeholder="Enter your password"
          className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />

{errorMessage.password && (
          <p className="text-red-500 text-sm mt-1">{errorMessage.password}</p>
        )}
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
          onChange={(e) => {setConfirmPassword(e.target.value); if (errorMessage.confirmPassword)
            setErrorMessage({ ...errorMessage, confirmPassword: "" });}}
          placeholder="Confirm your password"
          className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />

{errorMessage.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errorMessage.confirmPassword}</p>
        )}
      </div>

      {errorMessage.general && (
        <div className="text-red-500 text-sm mt-2">{errorMessage.general}</div>
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
