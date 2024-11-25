const LearningSection = () => {
    return (
      <div className="bg-customGray py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Learn faster with your best language tutor
              </h2>
              <p className="text-gray-600 mb-6">
                Get personalized attention and feedback from experienced language tutors
              </p>
              <button className="bg-lime-400 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-lime-500">
                Find a Tutor
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="/assets/tutor2.jpg"
                alt="Online tutoring session"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default LearningSection