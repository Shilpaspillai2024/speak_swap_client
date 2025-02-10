import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-customBlue text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">SpeakSwap</h3>
            <p className="text-sm">Connect. Learn. Grow.</p>
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0">
            {/* <a href="#" aria-label="LinkedIn">
              <img src="/assets/linkedin.png" alt="LinkedIn" className="h-6 w-6" />
            </a>
           
          */}

            <a href="#" aria-label="LinkedIn">
              <Image
                src="/assets/linkedin.png"
                alt="LinkedIn"
                width={24}
                height={24}
              />
            </a>

            <a href="#" aria-label="Facebook">
              <Image
                src="/assets/facebook.png"
                alt="Facebook"
                width={24}
                height={24}
              />
            </a>

            <a href="#" aria-label="Twitter">
              <Image
                src="/assets/twitter.png"
                alt="Twitter"
                width={24}
                height={24}
              />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} SpeakSwap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
