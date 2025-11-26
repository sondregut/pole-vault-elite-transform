
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Instagram, Twitter, Linkedin, Globe, Mail, Phone } from "lucide-react";

const MediaKit = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Background Image */}
      <header
        className="w-full relative py-32 text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//hero%20section%20image.jpg')`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
            <img
              src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20adidas.jpg"
              alt="Sondre Guttormsen"
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Sondre Guttormsen</h1>
              <h2 className="text-xl md:text-2xl font-medium">Olympic Pole Vaulter</h2>
              <p className="text-lg mt-2 opacity-90">2x Olympian | European Champion | Norwegian Record Holder</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">CONTACT</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center">
                <Phone className="mr-4 text-primary" />
                <p>+1 424-535-8644</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <Mail className="mr-4 text-primary" />
                <p>sondre@stavhopp.no</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center">
                <Globe className="mr-4 text-primary" />
                <p>www.stavhopp.no</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Media */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">SOCIAL MEDIA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Instagram className="mr-3 text-primary" />
                  <h3 className="font-medium">@sondre_pv</h3>
                </div>
                <p className="text-gray-600">101k followers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Twitter className="mr-3 text-primary" />
                  <h3 className="font-medium">@sondre_pv</h3>
                </div>
                <p className="text-gray-600">270k followers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Linkedin className="mr-3 text-primary" />
                  <h3 className="font-medium">Sondre Guttormsen</h3>
                </div>
                <p className="text-gray-600">Connect on LinkedIn</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Profile */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">PROFILE</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                I am a two-time Olympian, proudly representing Norway in the pole vault. As a dual citizen of Norway and the United States, I have had the unique privilege of drawing from the best of both worlds in my journey as an athlete. My greatest achievements include an 8th place finish at the Paris Olympics, winning the European Championship in 2023, competing multiple times at the World Championships, and becoming a four-time Norwegian Champion. I also hold the Norwegian pole vault record with a height of 6 meters or 19 feet 8.25 inches.
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed">
                I am deeply passionate about pole vaulting and feel privileged to dedicate my life to the sport I love. Alongside my athletic career, I graduated from Princeton University and earned a master's degree in Sport Management from the University of Texas, Austin.
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed">
                Outside of competition, I am an active content creator on social media. I share everything from training tips and techniques to travel adventures and personal insights. My goal is to inspire and connect with my audience by giving them a glimpse into the life of a professional athlete. Whether it's highlighting the dedication behind my sport or showcasing moments from my daily life, I love engaging with my community and encouraging others to pursue their passions.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Sponsors */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">SPONSORS</h2>
          <h3 className="text-lg mb-4 text-gray-600">Official partnerships and collaborations</h3>
          
          <div className="mb-10">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h4 className="font-bold">adidas</h4>
                    <p className="text-gray-600">2023 - Present</p>
                    <p className="text-primary font-medium">Current Partner</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="text-gray-400">Adidas Logo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h4 className="text-xl font-semibold mb-4">Previous Projects</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold">Bassengutstyr Norway (Sauna)</h4>
                <p className="text-gray-600">2022</p>
                <p className="text-gray-500">Former Partner</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold">Recharge Health</h4>
                <p className="text-gray-600">2023</p>
                <p className="text-gray-500">Former Partner</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold">ReAthlete</h4>
                <p className="text-gray-600">2021</p>
                <p className="text-gray-500">Former Partner</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Athletic Achievements */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">ATHLETIC ACHIEVEMENTS</h2>
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">European Champion Indoor - Istanbul, Turkey</TableCell>
                    <TableCell>March 2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Norwegian Indoor Record 6.00m</TableCell>
                    <TableCell>2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Norwegian Outdoor Record 5.90m - Austin, Texas</TableCell>
                    <TableCell>2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">World Championships Outdoor 10th Place - Eugene, USA</TableCell>
                    <TableCell>August 2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">World Championships Indoor 8th place - Belgrade, Serbia</TableCell>
                    <TableCell>2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Diamond League final 2nd place - Zurich, Switzerland</TableCell>
                    <TableCell>September 2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Multiple time podium Diamond League</TableCell>
                    <TableCell>2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ranked nr. 5 in the world (Track and Field news 2022)</TableCell>
                    <TableCell>2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2020 Tokyo Olympics Participant</TableCell>
                    <TableCell>August 2021</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Norwegian Champion x4</TableCell>
                    <TableCell>2022, 2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3x NCAA Champion</TableCell>
                    <TableCell>2022, 2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024 Paris Olympics 8th Place</TableCell>
                    <TableCell>August 2024</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">EDUCATION</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg">Princeton University, Princeton, New Jersey</h3>
                <p className="text-gray-600">Bachelor Degree, Psychology</p>
                <p className="text-gray-500">2020-2023</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg">University of California, Los Angeles</h3>
                <p className="text-gray-600">Coursework in Psychology and life sciences</p>
                <p className="text-gray-500">2018-2019</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg">University of Texas, Austin</h3>
                <p className="text-gray-600">Masters Degree in Sport Management</p>
                <p className="text-gray-500">2023-Oct. 2024</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Sponsor */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">MAIN SPONSOR</h2>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg">Adidas</h3>
              <p className="text-gray-600">2023 - 2025</p>
            </CardContent>
          </Card>
        </section>

        {/* Photo Gallery */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-primary-dark">PHOTO GALLERY</h2>
          <p className="text-gray-600 mb-6">High-resolution images available for media use. Contact for full-size downloads.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre23%20jubel.jpeg"
                alt="Sondre Guttormsen Celebration"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">European Championship Celebration</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20norway%20get%20ready%20pic.png"
                alt="Sondre Guttormsen Competition"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Competition Ready</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Screenshot%202025-04-14%20at%202.10.32%20PM.png"
                alt="Sondre Guttormsen Action Shot"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">In Action</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg"
                alt="Sondre Guttormsen Pole Vault Flight"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Mid-Vault Flight</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg"
                alt="Sondre Guttormsen Training"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Strength Training</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//coaching.jpeg"
                alt="Sondre Guttormsen Coaching"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Coaching Session</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//training.jpg"
                alt="Sondre Guttormsen Training"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Training Session</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//sondre%20and%20simen.jpg"
                alt="Sondre Guttormsen with Coach"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">With Team Guttormsen</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//tempo%202.PNG"
                alt="Sondre Guttormsen Technique"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Technique Analysis</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//Screenshot%202025-05-03%20at%202.46.16%20PM.png"
                alt="Sondre Guttormsen"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Professional Headshot</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//dad%20simen%20sondre.JPG"
                alt="Sondre Guttormsen with Family"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Team Guttormsen Family</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img
                src="https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//zoom%20.jpg"
                alt="Sondre Guttormsen Interview"
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Media Interview</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MediaKit;
