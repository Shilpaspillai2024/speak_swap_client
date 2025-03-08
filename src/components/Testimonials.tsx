import Image from "next/image";

const Testimonials = () => {
  const testimonials = [
    {
      text: "SpeakSwap helped me improve my language skills through real conversations with native speakers. The platform is intuitive and engaging.",
      author: "Sarah M.",
      role: "English Learner",
    },
    {
      text: "I've made friends from all around the world while practicing languages. The community here is incredibly supportive and encouraging.",
      author: "Miguel R.",
      role: "Spanish Teacher",
    },
    {
      text: "The video chat feature makes it easy to practice speaking naturally. I've seen significant improvement in my fluency.",
      author: "Yuki T.",
      role: "Japanese Learner",
    },
  ];

  return (
    <div className="bg-emerald-500 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-gray-600 mb-4 leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">
                    {testimonial.author[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <Image
              src="/assets/img3.png"
              alt="Global community illustration"
              className="w-full h-auto object-contain max-w-md mx-auto"
              width={500}
              height={500}
            />
          </div>
          <div className="md:w-1/2 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Join Our Global Community
            </h2>
            <div className="grid gap-6">
              <div className="bg-emerald-400 p-6 rounded-lg">
                <p className="leading-relaxed">
                  Connect with language learners from over 150 countries
                </p>
              </div>
              <div className="bg-emerald-400 p-6 rounded-lg">
                <p className="leading-relaxed">
                  Practice with native speakers in a supportive environment
                </p>
              </div>
              <div className="bg-emerald-400 p-6 rounded-lg">
                <p className="leading-relaxed">
                  Access a wide range of languages and cultural exchange
                  opportunities
                </p>
              </div>
            </div>
            <button className="mt-8 bg-lime-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-lime-500 transition-colors duration-300">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
