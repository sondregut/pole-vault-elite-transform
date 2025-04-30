
const AthleteResults = () => {
  const athletes = [
    {
      name: "Michael Thompson",
      image: "https://static.readdy.ai/image/cac8dfb8ebb3b9722f729c6a17eb3793/2d06a10cf356eb9642e53c2a1bc64db9.png",
      improvement: "+1.2m Improvement",
      quote: "After just 8 weeks of coaching, I improved my PR by over a meter. The technical adjustments made all the difference.",
      info: "College Athlete • 3 months with us"
    },
    {
      name: "Sarah Johnson",
      image: "/athlete-1.jpg", 
      improvement: "+0.8m Improvement",
      quote: "The personalized feedback on my technique videos helped me identify issues I never knew existed. Game changer!",
      info: "High School Athlete • 6 months with us"
    },
    {
      name: "Robert Miller",
      image: "/athlete-2.jpg",
      improvement: "+0.6m Improvement",
      quote: "Even as a masters athlete, I was able to improve significantly. The strength program was perfectly tailored to my needs.",
      info: "Masters Athlete • 4 months with us"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Athlete Results That Speak for Themselves
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Our athletes consistently improve their personal records and technique 
            through our specialized coaching programs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {athletes.map((athlete, index) => (
            <div key={index} className="bg-white rounded shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img
                  src={athlete.image}
                  alt={`${athlete.name} Before/After`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{athlete.name}</h3>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {athlete.improvement}
                  </span>
                </div>
                <p className="text-gray-600">"{athlete.quote}"</p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-500">{athlete.info}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AthleteResults;
