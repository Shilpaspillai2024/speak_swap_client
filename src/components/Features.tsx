import React from 'react'

const Features = () => {
    const features = [
        {
          icon: "🗣️",
          title: "Practice with Native Speakers",
          description: "Connect with language partners who are native speakers of your target language."
        },
        {
          icon: "💬",
          title: "Real Conversations",
          description: "Engage in natural conversations and improve your speaking skills."
        },
        {
          icon: "🌍",
          title: "Global Community",
          description: "Join a worldwide community of language learners and make friends globally."
        }
      ];
    
      return (
        <div className="bg-emerald-500 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Why Choose SpeakSwap for Language Learning?
                </h2>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex flex-col items-center">
                    <div className="mb-6">
                      <img
                        src="/assets/icon1.png"
                        alt="Video chat feature"
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-blue-900 mb-3">
                        Live Conversations
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Engage in live conversations through chat and video calls to improve your fluency
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <span className="text-3xl mb-4 block">{feature.icon}</span>
                    <h3 className="text-xl font-semibold mb-2 text-blue-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
}

export default Features
