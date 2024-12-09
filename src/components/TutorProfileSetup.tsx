import React, { useState, useEffect } from "react";
import { fetchCountries, fetchLanguages } from "@/services/geoApi";
import { tutorProfileSetup } from "@/services/tutorApi";
import { toast } from "react-toastify";
import { tutorSignupStore } from "@/store/userSignupStore";

const TutorProfileSetup = ({
  onPrevStep,
  onNextStep,
}: {
  onPrevStep: () => void;
  onNextStep: () => void;
}) => {
  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    country: "",
    teachLanguage: "",
    knownLanguages: [] as string[],
    profilePhoto: null as File | null,
    certificates: null as File | null,
    introductionVideo: null as File | null,
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
   const {token}=tutorSignupStore();


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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [name]: file });
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   

    const data = {
      token,
      dob: formData.dob,
      gender: formData.gender,
      country: formData.country,
      teachLanguage: formData.teachLanguage,
      knownLanguages: formData.knownLanguages,
      profilePhoto: formData.profilePhoto,
      certificates: formData.certificates ? [formData.certificates] : [],
      introductionVideo: formData.introductionVideo,
    };
    try {
     
      const response=await tutorProfileSetup(data)
      toast.success("Profile details added successfully")
      onNextStep();
    } catch (error) {
      toast.error("something went wrong! try again")
      
    }
};

  return (
    <div className="w-full  p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Tutor Profile Setup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Gender</label>
          <div className="flex items-center gap-4">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="country"
            className="block font-semibold"
          >
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Languages to Teach</label>
          <select
            name="teachLanguage"
            value={formData.teachLanguage}
            onChange={handleChange}
            className="mt-1 block w-full p-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Select Language</option>
            {languages.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Known Languages</label>
          <input
            type="text"
            name="knownLanguages"
            value={formData.knownLanguages.join(", ")}
            onChange={(e) => {
              const languages = e.target.value
                .split(",")
                .map((lang) => lang.trim());
              setFormData({ ...formData, knownLanguages: languages });
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter languages separated by commas"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">
            Upload Profile Picture
          </label>
          <input
            type="file"
            name="profilePhoto"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">
            Upload Certificates
          </label>
          <input
            type="file"
            name="certificates"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">
            Upload Introduction Video
          </label>
          <input
            type="file"
            name="introductionVideo"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevStep}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorProfileSetup;
