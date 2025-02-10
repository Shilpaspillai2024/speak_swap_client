import Image from "next/image";
const GlobalSection = () => {
    return (
      <div className="bg-blue-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Connect, Share, Grow</h2>
            <p className="text-gray-600 mt-4">
              Join thousands of language learners worldwide who are already improving
              their language skills through real conversations
            </p>
          </div>
          <div className="flex justify-center">
            {/* <img
              src="/assets/com.jpg"
              alt="Global community illustration"
              className="rounded-lg shadow-lg"
            /> */}
            <Image
            src="/assets/com.jpg"
            alt="Global community illustration"
            width={600} // Set appropriate width
            height={400} // Set appropriate height
            className="rounded-lg shadow-lg"
          />
          </div>
        </div>
      </div>
    );
  };
  export default GlobalSection