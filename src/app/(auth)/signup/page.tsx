"use client";

import OtpVerification from "@/components/OtpVerification";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchCountries, fetchLanguages } from "@/services/geoApi";
import {
  signupBasicDatails,
  updateProfile,
  interest,
  uploadPicture,
} from "@/services/userApi";
import { toast } from "react-toastify";
import userSignupStore from "@/store/userSignupStore";
import SetPassword from "@/components/SetPassword";
import { signupValidationSchema } from "@/utils/Validation";
import { SignupErrors } from "@/utils/Types";

const UserSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    nativeLanguage: "",
    learnLanguage: "",
    learnProficiency: "",
    knownLanguages: [] as string[],
    talkAbout: "",
    learningGoal: "",
    whyChat: "",
    profilePhoto: null as File | null
  });

  const { setToken } = userSignupStore();
  const [currentStep, setCurrentStep] = useState(1);

  const [countries, setCountries] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const { token } = userSignupStore();
  const router = useRouter();

  const[errors,setErrors]=useState<SignupErrors>({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCountries = await fetchCountries();
        const fetchedLanguages = await fetchLanguages();
        setCountries(fetchedCountries);
        setLanguages(fetchedLanguages);
      } catch (error) {
        console.log("Error loading data", error);
        setCountries([]);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleNextStep = async () => {
    if (currentStep === 1) {


      const bascicValidation =signupValidationSchema.shape.basicDetails.safeParse({
        name:formData.name,
        email:formData.email,
        phone:formData.phone
      })

      if(!bascicValidation.success){
        const fieldErrors =bascicValidation.error.format()
        setErrors({
          name: fieldErrors.name?._errors[0],
          email: fieldErrors.email?._errors[0],
          phone: fieldErrors.phone?._errors[0],
        });
        return;
      }
      setErrors({})
      try {
        const response = await signupBasicDatails({
          fullName: formData.name,
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
    if (currentStep === 4) {
      const languageValidation =signupValidationSchema.shape.languageDetails.safeParse({
        country: formData.country,
        nativeLanguage: formData.nativeLanguage,
        knownLanguages: formData.knownLanguages,
        learnLanguage: formData.learnLanguage,
        learnProficiency: formData.learnProficiency,
        
      })

      if (!languageValidation.success) {
        const fieldErrors = languageValidation.error.format();
        setErrors({
          country: fieldErrors.country?._errors[0],
          nativeLanguage: fieldErrors.nativeLanguage?._errors[0],
          learnLanguage: fieldErrors.learnLanguage?._errors[0],
          learnProficiency: fieldErrors.learnProficiency?._errors[0],
          knownLanguages: fieldErrors.knownLanguages?._errors[0],
        });
        return;
       
      }
      setErrors({})
      try {
        const response = await updateProfile({
          token,
          country: formData.country,
          nativeLanguage: formData.nativeLanguage,
          learnLanguage: formData.learnLanguage,
          learnProficiency: formData.learnProficiency,
          knownLanguages: formData.knownLanguages,
        });
        console.log("response", response);

        toast.success("Additional details saved");
        setCurrentStep(5);
      } catch (error) {
        toast.error("Error submitting details");
      }
    }
    if (currentStep === 5) {


      const interestValidation =signupValidationSchema.shape.interestDetails.safeParse({
        talkAbout:formData.talkAbout,
        learningGoal:formData.learningGoal,
        whyChat:formData.whyChat

        
      })

      if (!interestValidation.success) {
        const fieldErrors = interestValidation.error.format();
        setErrors({
          talkAbout: fieldErrors.talkAbout?._errors[0],
          learningGoal: fieldErrors.learningGoal?._errors[0],
          whyChat: fieldErrors.whyChat?._errors[0],
          
        });
        return;
       
      }
      setErrors({})
      try {
        const response = await interest({
          token,
          talkAbout: formData.talkAbout,
          learningGoal: formData.learningGoal,
          whyChat: formData.whyChat,
        });

        toast.success(response);
        setCurrentStep(6); 
      } catch (error) {
        toast.error("Error submitting interest details");
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const selectedLanguages = inputValue
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang !== "");

    setFormData((prev) => ({ ...prev, knownLanguages: selectedLanguages }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      profilePhoto: file,  
    }));
  };

  const handleFinalStep=async()=>{
    try {
      if(formData.profilePhoto){
        const image=await uploadPicture({token,
          profilePhoto:formData.profilePhoto
        })

        toast.success("image uplaod Successfull")
        router.push('/success')
      }else{
        toast.error("Please select a profile picture")
      }
      
    } catch (error) {
      toast.error("something went wrong when uploading profile picture");
      
    }
  }

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

                 <p className="text-red-600 text-xs min-h-[1em]">{errors.name}</p>
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
                 <p className="text-red-600 text-xs min-h-[1em]">{errors.email}</p>
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
                  <p className="text-red-600 text-xs min-h-[1em]">{errors.phone}</p>
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

          {/* step 2 otp verification */}
          {currentStep === 2 && (
            <OtpVerification
              onNextStep={() => setCurrentStep(3)}
              
            />
          )}

          {/* step 3 password setup */}

          {currentStep === 3 && (
            <SetPassword
              onNextStep={() => setCurrentStep(4)}
              onPrevStep={handlePrevStep}
            />
          )}

          {/* step 4  language country selection*/}
          {currentStep === 4 && (
            <form className="space-y-6">
              {/* Country selection */}
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
                  {countries.map((country, index) => (
                    <option key={index} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <p className="text-red-600 text-xs min-h-[1em]">{errors.country}</p>
              </div>

              {/* Native Language selection */}
              <div>
                <label
                  htmlFor="nativeLanguage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Native Language
                </label>
                <select
                  id="nativeLanguage"
                  name="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Native Language</option>
                  {languages.map((language, index) => (
                    <option key={index} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <p className="text-red-600 text-xs min-h-[1em]">{errors.nativeLanguage}</p>
              </div>

              {/* Known Languages */}
              <div>
                <label
                  htmlFor="knownLanguages"
                  className="block text-sm font-medium text-gray-700"
                >
                  Known Languages
                </label>
                <input
                  type="text"
                  id="knownLanguages"
                  name="knownLanguages"
                  value={formData.knownLanguages}
                  onChange={handleMultiSelectChange}
                  placeholder="Enter known languages, separated by commas"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                 <p className="text-red-600 text-xs min-h-[1em]">{errors.knownLanguages}</p>
              </div>

              {/* Learning Language selection */}
              <div>
                <label
                  htmlFor="learnLanguage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Language You Want to Learn
                </label>
                <select
                  id="learnLanguage"
                  name="learnLanguage"
                  value={formData.learnLanguage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Language to Learn</option>
                  {languages.map((language, index) => (
                    <option key={index} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <p className="text-red-600 text-xs min-h-[1em]">{errors.learnLanguage}</p>
              </div>

              {/* Learning Proficiency */}
              <div>
                <label
                  htmlFor="learnProficiency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Learning Proficiency
                </label>
                <select
                  id="learnProficiency"
                  name="learnProficiency"
                  value={formData.learnProficiency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <p className="text-red-600 text-xs min-h-[1em]">{errors.learnProficiency}</p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 bg-gray-500 text-white py-3 rounded-3xl font-medium hover:opacity-90"
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

          {/* step 5  interest*/}
          {currentStep === 5 && (
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="talk_about"
                  className="block text-sm font-medium text-gray-700"
                >
                  What do you like to talk about?
                </label>
                <textarea
                  id="talkAbout"
                  name="talkAbout"
                  value={formData.talkAbout}
                  onChange={handleTextAreaChange}
                  placeholder="Enter topics you enjoy discussing"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                 <p className="text-red-600 text-xs min-h-[1em]">{errors.talkAbout}</p>
              </div>

              <div>
                <label
                  htmlFor="learningGoal"
                  className="block text-sm font-medium text-gray-700"
                >
                  What is your learning goal?
                </label>
                <textarea
                  id="learningGoal"
                  name="learningGoal"
                  value={formData.learningGoal}
                  onChange={handleTextAreaChange}
                  placeholder="Enter your learning goals"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                 <p className="text-red-600 text-xs min-h-[1em]">{errors.learningGoal}</p>
              </div>

              <div>
                <label
                  htmlFor="whyChat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Why should others chat with you?
                </label>
                <textarea
                  id="whyChat"
                  name="whyChat"
                  value={formData.whyChat}
                  onChange={handleTextAreaChange}
                  placeholder="Enter reasons people should chat with you"
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                 <p className="text-red-600 text-xs min-h-[1em]">{errors.whyChat}</p>
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

        {/* Step 6: Profile Picture Upload */}
          {currentStep === 6 && (
            <form>
              <div>
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  onChange={handleFileChange}
                  className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleFinalStep}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-3xl"
              >
                Upload & Save
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
