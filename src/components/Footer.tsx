import React from 'react'

const Footer = () => {
    return (
      <footer className="bg-customBlue text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">SpeakSwap</h3>
              <p className="text-sm">Connect. Learn. Grow.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-200">LinkedIn</a>
              <a href="#" className="hover:text-blue-200">Facebook</a>
              <a href="#" className="hover:text-blue-200">Twitter</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SpeakSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  

export default Footer
