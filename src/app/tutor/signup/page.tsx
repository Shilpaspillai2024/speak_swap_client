"use client";
import { useState } from "react";
import OtpVerification from "@/components/OtpVerification";
import SetPassword from "@/components/SetPassword";
import { tutorBasicDetails } from "@/services/tutorApi";
import { tutorSignupStore } from "@/store/userSignupStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signupValidationSchema } from "@/utils/Validation";
import { SignupErrors } from "@/utils/Types";
import TutorProfileSetup from "@/components/TutorProfileSetup";

const TutorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const [errors, setErrors] = useState<SignupErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const { token, setToken } = tutorSignupStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      const bascicValidation =
        signupValidationSchema.shape.basicDetails.safeParse({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });

      if (!bascicValidation.success) {
        const fieldErrors = bascicValidation.error.format();
        setErrors({
          name: fieldErrors.name?._errors[0],
          email: fieldErrors.email?._errors[0],
          phone: fieldErrors.phone?._errors[0],
        });
        return;
      }
      setErrors({});
      try {
        const response = await tutorBasicDetails({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });

        const token = response.token;
        setToken(token);

        toast.success("Basic details saved");
        setCurrentStep(2);
      } catch (error: any) {
        toast.error(error);
      }
    }
  };
  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleFinalStep = () => {
    router.push("/success");
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="flex w-full sm:w-2/3 lg:w-2/3 h-full max-w-screen-lg">
          {/* Step 1: Registration Form */}
          {currentStep === 1 && (
            <div className="w-full sm:w-1/2 h-full flex items-stretch">
              <img
                src="/assets/lg.jpg"
                alt="Tutoring image"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {currentStep === 1 && (
            <form
              onSubmit={handleNextStep}
              className="bg-gradient-to-r from-[#F0F8FF] to-[#A6D0D9] p-8 rounded-lg shadow-lg w-full sm:w-1/2 h-full flex flex-col justify-between"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
                Tutor Register
              </h2>

              <div className="mb-2">
                <label className="block mb-2 font-semibold text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
                <p className="text-red-600 text-xs min-h-[1em]">
                  {errors.name}
                </p>
              </div>

              <div className="mb-2">
                <label className="block mb-2 font-semibold text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <p className="text-red-600 text-xs min-h-[1em]">
                  {errors.email}
                </p>
              </div>

              <div className="mb-2">
                <label className="block mb-2 font-semibold text-gray-600">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
                <p className="text-red-600 text-xs min-h-[1em]">
                  {errors.phone}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-3xl font-medium hover:opacity-90 focus:ring-2 focus:ring-purple-500"
              >
                Register
              </button>
            </form>
          )}

          {/* Step 2 Onwards: OTP Verification and Set Password */}
          {currentStep > 1 && (
            <div className="flex w-full max-w-5xl bg-white bg-opacity-30 backdrop-blur-lg shadow-2xl overflow-hidden rounded-3xl">
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
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                  SignUp
                </h2>

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                  <OtpVerification
                    onNextStep={() => setCurrentStep(3)}
                    role="tutor"
                  />
                )}

                {/* Step 3: Set Password */}
                {currentStep === 3 && (
                  <SetPassword
                    onNextStep={() => setCurrentStep(4)}
                    onPrevStep={handlePrevStep}
                    role="tutor"
                  />
                )}

                {/* step 4:final setp */}

                {currentStep === 4 && (
                  <div className="flex w-full">
                    <TutorProfileSetup
                      onNextStep={handleFinalStep}
                      onPrevStep={handlePrevStep}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorRegister;
