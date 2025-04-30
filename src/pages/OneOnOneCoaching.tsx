
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const OneOnOneCoaching = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section w-full pt-20 relative">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Transform Your Vaulting with Personalized Coaching from an Olympian
            </h1>
            <p className="text-lg md:text-xl text-white/90 mt-6">
              Elevate your technique, achieve new heights, and train with world-class guidance from an Olympic pole vault champion.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-blue-600 transition whitespace-nowrap flex items-center justify-center"
              >
                <i className="ri-user-star-line mr-2 text-xl"></i>
                Start Training Today
              </Button>
              <Button
                variant="outline"
                className="bg-white text-primary px-6 py-3 rounded-button font-medium hover:bg-gray-100 transition whitespace-nowrap flex items-center justify-center"
              >
                <i className="ri-calendar-line mr-2 text-xl"></i>
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 1:1 Coaching Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              1:1 Coaching Experience
            </h2>
            <p className="text-lg text-gray-600">
              Our personalized coaching program combines expert guidance with cutting-edge technology to help you reach your full potential.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Personalized Coaching for Every Vaulter
              </h3>
              <p className="text-gray-600 mb-6">
                Whether you're just starting out or competing at an elite level, our 1:1 coaching program adapts to your specific needs, goals, and circumstances.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3 text-gray-600">Weekly communication with Coach Sondre</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3 text-gray-600">Regular Zoom calls for in-depth technique review</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3 text-gray-600">Custom training programs delivered through our app</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3 text-gray-600">Detailed video analysis and feedback</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Perfect for athletes of all levels who want to take their performance to the next level, whether you have a team coach or need fully written programming.
              </p>
              <a
                href="#coaching-process"
                className="inline-flex items-center text-primary font-medium hover:text-blue-700 transition"
              >
                Learn more about our coaching process
                <i className="ri-arrow-right-line ml-2"></i>
              </a>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                alt="1:1 Coaching Session"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div
                className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-lg"
              >
                <div className="text-xl font-bold">97%</div>
                <div className="text-sm">Performance Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Coaching Process */}
      <section id="coaching-process" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coaching Process Overview
            </h2>
            <p className="text-lg text-gray-600">
              Our structured approach ensures you receive comprehensive support from initial assessment to goal achievement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md step-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Apply for Coaching
              </h3>
              <p className="text-gray-600">
                Fill out our application form detailing your goals, experience, and what you hope to achieve.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Brief overview of your goals</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Select preferred coaching package</span>
                </li>
              </ul>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md step-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Initial Zoom Consultation
              </h3>
              <p className="text-gray-600">
                Connect with Coach Sondre to discuss your goals and establish expectations.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">One-on-one call with Sondre</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Review coaching process</span>
                </li>
              </ul>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md step-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Assessment Form
              </h3>
              <p className="text-gray-600">
                Complete a detailed assessment to help us understand your current situation.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Training history</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Equipment access</span>
                </li>
              </ul>
            </div>
            {/* Step 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md step-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Setup</h3>
              <p className="text-gray-600">
                Get set up with our training and video review apps for seamless coaching.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Download training app</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Download video review app</span>
                </li>
              </ul>
            </div>
            {/* Step 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md step-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                5
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                First Week Program
              </h3>
              <p className="text-gray-600">
                Receive your first customized training program and begin your journey.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Customized training plan</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Exercise demonstrations</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Flexible Integration Options
            </h3>
            <p className="text-gray-600 mb-6">
              Our coaching program is designed to work with your current situation, whether you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary mb-3">
                  <i className="ri-team-line text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Already have a coach or team
                </h4>
                <p className="text-sm text-gray-600">
                  We'll complement your existing training with specialized pole vault expertise.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary mb-3">
                  <i className="ri-edit-line text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Need complete programming
                </h4>
                <p className="text-sm text-gray-600">
                  We'll create a comprehensive training plan tailored to your specific needs.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="w-10 h-10 flex items-center justify-center text-primary mb-3">
                  <i className="ri-calendar-line text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Have other training commitments
                </h4>
                <p className="text-sm text-gray-600">
                  We'll integrate our program with your existing schedule and commitments.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Communication Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                  <i className="ri-message-3-line"></i>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Weekly Check-ins
                  </h4>
                  <p className="text-gray-600">
                    Regular communication with Coach Sondre to discuss progress and adjustments.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                  <i className="ri-vidicon-line"></i>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Zoom Coaching Calls
                  </h4>
                  <p className="text-gray-600">
                    In-depth video sessions to review technique and address specific challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coaching App Features
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive mobile and web application puts powerful training tools at your fingertips.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md feature-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="ri-calendar-check-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Program Tracking
              </h3>
              <p className="text-gray-600">
                Access your personalized training program, track completed workouts, and monitor your progress over time.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Daily workout schedules</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Exercise completion tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Progress visualization</span>
                </li>
              </ul>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md feature-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="ri-movie-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Video Analysis</h3>
              <p className="text-gray-600">
                Upload videos of your vaults for detailed analysis and receive expert feedback from your coach.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Easy video uploads</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Frame-by-frame analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Coach annotations and feedback</span>
                </li>
              </ul>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md feature-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="ri-bar-chart-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Workout Logging
              </h3>
              <p className="text-gray-600">
                Record your training metrics, including vault heights, sprint times, and strength numbers.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Performance metrics tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Training load monitoring</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Personal records tracking</span>
                </li>
              </ul>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md feature-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="ri-book-open-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Technique Library
              </h3>
              <p className="text-gray-600">
                Access a comprehensive library of technique videos, drills, and educational content.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Drill demonstration videos</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Technique breakdowns</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Educational articles</span>
                </li>
              </ul>
            </div>
            {/* Feature Card 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md feature-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="ri-chat-3-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Coach Messaging
              </h3>
              <p className="text-gray-600">
                Direct communication with your coach for questions, feedback, and guidance.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Real-time messaging</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Photo and video sharing</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Quick response times</span>
                </li>
              </ul>
            </div>
            {/* Feature Card 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md feature-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <i className="ri-line-chart-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Visualize your improvement over time with detailed progress charts and analytics.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Performance graphs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Goal achievement tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-primary">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-2">Long-term development metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">App Interface</h2>
            <p className="text-lg text-gray-600">
              Explore our intuitive and powerful coaching application designed for pole vaulters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="app-screenshot">
              <img
                src="/app-screen-1.jpg"
                alt="Training Program Calendar"
                className="w-full h-auto"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Training Calendar</h3>
                <p className="text-sm text-gray-600">
                  View your weekly training schedule
                </p>
              </div>
            </div>
            <div className="app-screenshot">
              <img
                src="/video-analysis.jpg"
                alt="Video Analysis Screen"
                className="w-full h-auto"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Video Analysis</h3>
                <p className="text-sm text-gray-600">
                  Frame-by-frame technique review
                </p>
              </div>
            </div>
            <div className="app-screenshot">
              <img
                src="/app-screen-2.jpg"
                alt="Performance Metrics"
                className="w-full h-auto"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Performance Dashboard</h3>
                <p className="text-sm text-gray-600">Track your progress metrics</p>
              </div>
            </div>
            <div className="app-screenshot">
              <img
                src="/app-screen-3.jpg"
                alt="Coach Messaging"
                className="w-full h-auto"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Coach Messaging</h3>
                <p className="text-sm text-gray-600">
                  Direct communication with your coach
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a
              href="#"
              className="inline-flex items-center text-primary font-medium hover:text-blue-700 transition"
            >
              View more screenshots
              <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Athletes Say
            </h2>
            <p className="text-lg text-gray-600">
              Hear from vaulters who have transformed their performance with our coaching app.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md testimonial-card">
              <div className="flex items-center mb-4 text-yellow-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
              </div>
              <p className="text-gray-600 mb-6">
                "The video analysis feature completely transformed my technique. Being able to get frame-by-frame feedback from my coach and see the progress in my vaults over time has been invaluable."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  Athlete
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Rebecca Anderson</h4>
                  <p className="text-sm text-gray-500">
                    College Athlete • Using app for 8 months
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md testimonial-card">
              <div className="flex items-center mb-4 text-yellow-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
              </div>
              <p className="text-gray-600 mb-6">
                "Having my training program right on my phone has made it so much easier to stay consistent. I love being able to log my workouts and see my progress charts improving week after week."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  Athlete
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Michael Trevino</h4>
                  <p className="text-sm text-gray-500">
                    High School Athlete • Using app for 6 months
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md testimonial-card">
              <div className="flex items-center mb-4 text-yellow-400">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-half-fill"></i>
              </div>
              <p className="text-gray-600 mb-6">
                "The direct messaging with Coach Sondre has been a game-changer. Being able to get quick answers to my questions and share videos between our scheduled calls keeps me on track."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  Athlete
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sophia Martinez</h4>
                  <p className="text-sm text-gray-500">
                    Masters Athlete • Using app for 12 months
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Download Our App Today</h2>
              <p className="text-xl mb-8">
                Take your pole vault coaching experience to the next level with our comprehensive training app.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-white">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3">Available for iOS and Android devices</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-white">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3">Also accessible via web browser</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-0.5 text-white">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="ml-3">Free to download, premium features with coaching subscription</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-white text-primary px-6 py-3 rounded-button font-medium hover:bg-gray-100 transition whitespace-nowrap flex items-center justify-center"
                >
                  <i className="ri-apple-fill mr-2 text-xl"></i>
                  Download for iOS
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-button font-medium hover:bg-white/10 transition whitespace-nowrap flex items-center justify-center"
                >
                  <i className="ri-android-fill mr-2 text-xl"></i>
                  Download for Android
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80"
                  alt="App on Smartphone"
                  className="max-w-full h-auto rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our coaching app and 1:1 coaching process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do I need to be an elite vaulter to benefit from the app?
              </h3>
              <p className="text-gray-600">
                Not at all! Our coaching app is designed for vaulters of all levels, from beginners just starting out to elite athletes looking to refine their technique. The coaching and features adapt to your specific level and goals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How often will I receive feedback on my technique?
              </h3>
              <p className="text-gray-600">
                With our 1:1 coaching program, you'll receive weekly video analysis feedback, plus bi-weekly Zoom calls for more in-depth review. You can also message your coach directly through the app with questions at any time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I use the app without signing up for coaching?
              </h3>
              <p className="text-gray-600">
                Yes! The app has a free version that includes basic workout tracking and access to some technique resources. Premium features like video analysis and personalized programming require a coaching subscription.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does the video analysis feature work?
              </h3>
              <p className="text-gray-600">
                Simply record your vaults and upload them through the app. Your coach will analyze the video with professional tools, providing frame-by-frame feedback with voice commentary and visual annotations, usually within 48 hours.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I integrate this with my school or club training?
              </h3>
              <p className="text-gray-600">
                Absolutely! Many of our athletes use our coaching as a supplement to their school or club training. We'll work with you to ensure our program complements your existing training schedule and other commitments.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What kind of results can I expect?
              </h3>
              <p className="text-gray-600">
                Results vary based on your starting point, commitment, and physical attributes. On average, our athletes see improvements of 0.3-0.7m within 3-6 months of consistent training and technique implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Pole Vault Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join our community of athletes who are breaking personal records and achieving their goals with personalized coaching and cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-primary text-white px-8 py-3 rounded-button font-medium hover:bg-blue-600 transition whitespace-nowrap"
            >
              Apply for 1:1 Coaching
            </Button>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary-light px-8 py-3 rounded-button font-medium transition whitespace-nowrap"
            >
              Download the App
            </Button>
          </div>
          <p className="mt-6 text-gray-600">
            Not sure which option is right for you?{" "}
            <a href="#" className="text-primary underline hover:text-blue-700 transition">
              Schedule a free consultation
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />

      {/* Additional CSS */}
      <style jsx global>{`
        .hero-section {
          background-image: url('https://images.unsplash.com/photo-1561673071-10520d50b427?auto=format&fit=crop&q=80');
          background-size: cover;
          background-position: center;
        }
        
        .app-screenshot {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-radius: 16px;
          overflow: hidden;
        }
        
        .feature-card {
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
        }
        
        .testimonial-card {
          transition: all 0.3s ease;
        }
        
        .testimonial-card:hover {
          transform: translateY(-5px);
        }
        
        .step-card {
          position: relative;
        }
        
        .step-card:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 3rem;
          right: -1.5rem;
          width: 3rem;
          height: 2px;
          background-color: #e5e7eb;
          z-index: 0;
        }
        
        @media (max-width: 768px) {
          .step-card:not(:last-child)::after {
            top: auto;
            right: auto;
            bottom: -1.5rem;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OneOnOneCoaching;
