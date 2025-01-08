'use client'
import React, { useEffect, useState } from "react";
import { fetchProfile } from "@/services/tutorApi";
import Image from "next/image";
import TutorNavbar from "@/components/TutorNavbar";
import TutorSidebar from "@/components/TutorSidebar";
import { User, Mail, Phone, Globe, Calendar, Languages } from "lucide-react";

const TutorProfilePage = () => {
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadTutorProfile = async () => {
      try {
        const profileData = await fetchProfile();
        setTutor(profileData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTutorProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex">
        <TutorSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-teal-600 to-teal-400">
                <div className="absolute -bottom-16 left-8">
                  {tutor.profilePhoto ? (
                    <div className="rounded-full border-4 border-white overflow-hidden h-32 w-32">
                      <Image
                        src={tutor.profilePhoto}
                        alt="Tutor Profile"
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                      <User size={48} className="text-teal-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-20 pb-8 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{tutor.name}</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-teal-600" />
                        <span className="text-gray-600">{tutor.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-teal-600" />
                        <span className="text-gray-600">{tutor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-teal-600" />
                        <span className="text-gray-600">{tutor.country}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-teal-600" />
                        <span className="text-gray-600">
                          {new Date(tutor.dob).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-teal-50 rounded-lg p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Languages className="w-5 h-5 text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Languages</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Known Languages</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {tutor.knownLanguages.map((language: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Teaching Language</p>
                          <span className="inline-block mt-1 px-3 py-1 bg-teal-200 text-teal-800 rounded-full text-sm">
                            {tutor.teachLanguage}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${tutor.status === 'approved' ? 'bg-teal-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-600">
                        {tutor.status === 'approved' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;