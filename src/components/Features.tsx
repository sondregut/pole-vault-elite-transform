
const Features = () => {
  const features = [
    {
      icon: "ri-video-line",
      title: "Video Analysis",
      description: "Detailed breakdown of your technique with frame-by-frame analysis and personalized feedback."
    },
    {
      icon: "ri-calendar-line",
      title: "Custom Training Plans",
      description: "Personalized weekly training schedules based on your current level, goals, and available equipment."
    },
    {
      icon: "ri-chat-1-line",
      title: "1-on-1 Coaching",
      description: "Regular Zoom sessions with your coach to discuss progress, answer questions, and adjust your training."
    },
    {
      icon: "ri-smartphone-line",
      title: "Mobile App Access",
      description: "Track your progress, access your training plans, and communicate with your coach on the go."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What You'll Get</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Our comprehensive coaching approach addresses every aspect of pole vaulting success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className={`${feature.icon} text-primary text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
