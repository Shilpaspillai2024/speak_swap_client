import Link from 'next/link';

const Confirmation=()=>{
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-customBlue mb-4">
         Tutor Registration Successful!
        </h1>
        <p className="text-xl text-customBlue mb-6">
          Welcome to Speak Swap! 
        </p>
        <p>
          Your details have been successfully submitted for review. Our team will review your profile and confirm your settings within 24-48 hours.
        </p>
        <p className="text-gray-600 mb-6">
          We'll notify you through email once everything is approved and live!
        </p>
        <Link href="/tutor/login" className="inline-block bg-purple-600 text-white font-semibold py-2 px-4 rounded hover:bg-purple-700 transition">
          
            Go to Login
          
        </Link>
      </div>
    </div>
  );
}

export default Confirmation
