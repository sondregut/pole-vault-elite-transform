
const AthleteResults = () => {
  const athletes = [
    {
      name: "Owen Anderson",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Owen.png",
      quote: "Team Guttormsen took me from an all-time low to achieving a new personal best! After breaking my back, they were at my side educating me on how to work through a fractured back.",
      info: "Collegiate D1 Athlete • 3 months with us"
    },
    {
      name: "Garrett Lynch",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Garrett%20(1).png", 
      quote: "Sondre was always available for questions and concerns on training or technique. The training was tailored to me specifically and had me feeling strong and fast while recovering from injuries!",
      info: "Collegiate Pole Vaulter • Summer 2024"
    },
    {
      name: "Gabriel Thai",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Gabriel.png",
      quote: "In the two months I worked with Sondre over the summer, I added over a foot to my jump. With every video review, Sondre gave me helpful cues that greatly refined my jumps.",
      info: "Brown Track & Field • 2 months with us"
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
                  alt={`${athlete.name}`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{athlete.name}</h3>
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
