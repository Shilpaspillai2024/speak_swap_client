"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    continent: "",
    country: "",
    language: "",
    proficiency: "",
    learn_language: "",
    learn_proficiency: "",
    talk_about: "",
    learning_goal: "",
    why_chat: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const router = useRouter();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle step navigation (next step or previous step)
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  const handleFinalStep = () => {
    router.push("/success"); // Use router.push to navigate to the success page
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const sendOtp = () => {
    // Simulate sending OTP
    console.log(`Sending OTP to email: ${formData.email}`);
    setOtpSent(true);
    alert("OTP sent to your email address!");
  };

  const verifyOtp = () => {
    if (otp === "1234") {
      // Replace with actual OTP logic
      setIsOtpVerified(true);
      alert("OTP verified successfully!");
      setCurrentStep(3); // Move to Step 3
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
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
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">SignUp</h2>

          {/* Step 1: Basic Information Form */}
          {currentStep === 1 && (
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fullname
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

             

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
              >
                Next
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 2 && (
            <form className="space-y-6">
              <div>
                <p className="text-sm text-gray-700">
                  We've sent an OTP to your email. Please enter it below to
                  verify.
                </p>
                {otpSent ? (
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="w-full bg-purple-500 text-white font-semibold p-3 rounded-lg"
                  >
                    Send OTP
                  </button>
                )}
              </div>

              {otpSent && (
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full bg-green-500 text-white font-semibold p-3 rounded-lg"
                >
                  Verify OTP
                </button>
              )}
            </form>
          )}

           {/* step 3 for password setup */}

          {currentStep === 3 && (
            <form className="space-y-6">
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
                  value={formData.password}
                  onChange={handleInputChange}
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your password again"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
              >
                Next
              </button>
            </form>
          )}

          {/* Step 4: Select Continent, Country, Language, and Proficiency */}
          {currentStep === 4 && (
            <form className="space-y-6">
              {/* Continent Selection */}
              <div>
                <label
                  htmlFor="continent"
                  className="block text-sm font-medium text-gray-700"
                >
                  Continent
                </label>
                <select
                  id="continent"
                  name="continent"
                  value={formData.continent}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Continent</option>
                </select>
              </div>

              {/* Country Selection */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Country</option>
                </select>
              </div>

              {/* Language Selection */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700"
                >
                  Selct your Nativelanguage
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Language</option>
                </select>
              </div>

              {/* Proficiency Selection */}
              <div>
                <label
                  htmlFor="proficiency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Proficiency Level
                </label>
                <select
                  id="proficiency"
                  name="proficiency"
                  value={formData.proficiency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Proficiency Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 bg-gray-300 py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 3: selcting learn langue */}
          {currentStep === 5 && (
            <form className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  which languge would you like to learn ?
                </h3>

                {/* languge selection */}
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select languge
                  </label>
                  <select
                    id="learn_language"
                    name="learn_language"
                    value={formData.learn_language}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select Language</option>
                  </select>
                </div>

                {/* Proficiency Selection */}
                <div>
                  <label
                    htmlFor="proficiency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Proficiency Level
                  </label>
                  <select
                    id="learn_proficiency"
                    name="learn_proficiency"
                    value={formData.learn_proficiency}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select Proficiency Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 bg-gray-300 py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {currentStep === 6 && (
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="talk_about"
                  className="block text-sm font-medium text-gray-700"
                >
                  What do you like to talk about?
                </label>
                <textarea
                  id="talk_about"
                  name="talk_about"
                  value={formData.talk_about}
                  onChange={handleTextAreaChange}
                  placeholder="Enter topics you enjoy discussing"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="learning_goal"
                  className="block text-sm font-medium text-gray-700"
                >
                  What is your learning goal?
                </label>
                <textarea
                  id="learning_goal"
                  name="learning_goal"
                  value={formData.learning_goal}
                  onChange={handleTextAreaChange}
                  placeholder="Enter your learning goals"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="why_chat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Why should others chat with you?
                </label>
                <textarea
                  id="why_chat"
                  name="why_chat"
                  value={formData.why_chat}
                  onChange={handleTextAreaChange}
                  placeholder="Enter reasons people should chat with you"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 bg-gray-300 py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {currentStep === 5 && (
            <form>
              {/* Step 5: Profile Picture Upload */}
              <div>
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  // onChange={handleInputChange}  // Make sure you handle the file input
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleFinalStep} // When user completes the profile picture upload
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
