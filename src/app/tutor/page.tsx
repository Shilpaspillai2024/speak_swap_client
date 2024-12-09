'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";


const TuturLanding=()=> {
  const router=useRouter()

  const handleClick=()=>{
    router.push("/tutor/login")
    
  }
    return (
      <div className="font-sans bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-[#1E1E1E] px-6 py-4 flex justify-between items-center">
        <Link href="/"><h1 className="text-2xl font-bold">SpeakSwap</h1></Link>  
          <nav className="space-x-6">
            <Link href="#how-it-works" className="hover:underline">
              How it Works
            </Link>
            <Link href="/tutor/login" className="hover:underline">
              Login As Tutor
            </Link>
            <Link href="/tutor/signup" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500">
              Register
            </Link>
          </nav>
        </header>
  
        {/* Hero Section */}
        <section className="bg-green-100 text-black px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-4">
                Teach the World. Earn with Flexibility.
              </h2>
              <p className="mb-6">Share your expertise and connect with global learners.</p>
              <button className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-500" onClick={handleClick}>
                Get Started
              </button>
            </div>
            <img
        
              src="/assets/tutor.jpg"
              alt="Tutor Session"
              className="rounded-lg shadow-lg mt-6 md:mt-0"
            />
          </div>
        </section>
  
        {/* Features Section */}
        <section className="bg-teal-700 text-white px-6 py-12">
          <h3 className="text-2xl font-bold mb-6 text-center"
        >
          Why Teach With Us
        </h3>
        <div className="space-y-6 md:space-y-0 md:flex md:justify-around">
          <div className="max-w-sm">
            <h4 className="text-xl font-semibold">Flexible Scheduling</h4>
            <p className="mt-2">
              Teach on your terms! Set your availability and enjoy the freedom to manage your time.
            </p>
          </div>
          <div className="max-w-sm">
            <h4 className="text-xl font-semibold">Easy-to-Use Platform</h4>
            <p className="mt-2">
              Our intuitive tools make managing your sessions a breeze.
            </p>
          </div>
          <div className="max-w-sm">
            <h4 className="text-xl font-semibold">Global Reach</h4>
            <p className="mt-2">
              Expand your horizons by connecting with eager students from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white px-6 py-8">
        <div className="md:flex md:justify-between items-center">
          <div className="space-y-2">
            <h5 className="font-bold text-lg">Quick Links</h5>
            <nav className="space-y-1">
              <a href="#" className="block hover:underline">
                Home
              </a>
              <a href="#about-us" className="block hover:underline">
                About Us
              </a>
              <a href="#faq" className="block hover:underline">
                FAQ
              </a>
              <a href="#contact-us" className="block hover:underline">
                Contact Us
              </a>
            </nav>
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" aria-label="LinkedIn">
              <img src="/assets/linkedin.png" alt="LinkedIn" className="h-6 w-6" />
            </a>
           
            <a href="#" aria-label="facebook">
              <img src="/assets/facebook.png" alt="LinkedIn" className="h-6 w-6" />
            </a>


            <a href="#" aria-label="Twitter">
              <img src="/assets/twitter.png" alt="Twitter" className="h-6 w-6" />
            </a>
          </div>
        </div>
        <p className="text-center mt-6">&copy; 2024 SpeakSwap. All rights reserved.</p>
      </footer>
    </div>
  );
}
 
export default TuturLanding;
  