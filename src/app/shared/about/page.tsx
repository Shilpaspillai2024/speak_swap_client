import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Background */}
      <div className="bg-gradient-to-r from-teal-400 to-indigo-300 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-white mb-4 text-center">
            About SpeakSwap
          </h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Connecting language enthusiasts with native speakers worldwide
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          {/* Introduction Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                SpeakSwap is a cutting-edge language-sharing and learning platform designed to connect users with native speakers worldwide. Whether you're looking to enhance your speaking skills, meet new people, or dive into a new language, SpeakSwap provides the ideal environment for immersive and effective learning.
              </p>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Features Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Key Features
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Engage in real-time conversations with native speakers
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Book personalized 1-on-1 tutor sessions for tailored guidance
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Immerse yourself in authentic language experiences
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Access a diverse community of language enthusiasts
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Tutor Sessions Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Tutor Sessions
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  SpeakSwap offers a seamless <span className="font-semibold">tutor booking system</span>, allowing users to schedule <span className="font-semibold">1-hour sessions</span> with experienced and certified tutors. Whether you're seeking structured lessons or casual practice, our platform ensures a flexible and personalized learning experience tailored to your goals.
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottom Quote */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden text-center p-8">
            <blockquote className="text-xl italic text-gray-700">
              "Language is the road map of a culture. It tells you where its people come from and where they are going."
            </blockquote>
            <p className="mt-2 text-gray-500">- Rita Mae Brown</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
