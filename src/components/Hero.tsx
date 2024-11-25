import Image from "next/image";
import React from "react";

const Hero = () => {
    return (
        <div className="bg-customGray py-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Discover languages, make connections
            </h1>
            <h2 className="text-3xl text-blue-900 mb-6">
              Welcome to SpeakSwap
            </h2>
            <p className="text-customBlue mb-8">
              Start your online language exchange journey and connect with native speakers worldwide. 
              Practice speaking naturally and make friends across cultures.
            </p>
            <button className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600">
              Get Started
            </button>
          </div>
          <div className="hidden md:flex gap-4 items-start">
            <div className="relative top-[-40px]">
              <img
                src="/assets/2.png"
                alt="words"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <div>
              <img
                src="/assets/fifth.png"
                alt="Happy language learner"
                className="rounded-lg w-[500px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      );
};

export default Hero;
