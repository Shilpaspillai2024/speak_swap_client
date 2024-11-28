import React from "react";


const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-500 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;

