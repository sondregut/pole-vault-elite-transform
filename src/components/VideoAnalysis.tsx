
import { Button } from "@/components/ui/button";

const VideoAnalysis = () => {
  const features = [
    {
      icon: "ri-camera-line",
      title: "Easy Video Uploads",
      description: "Upload your jumps directly through TrainHeroic or send them via email - whatever works best for you."
    },
    {
      icon: "ri-edit-line",
      title: "Detailed Analysis",
      description: "Receive comprehensive feedback with drawn annotations, slow-motion breakdown, and specific cues for improvement."
    },
    {
      icon: "ri-video-chat-line",
      title: "Follow-up Consultation",
      description: "Schedule a video call to discuss the analysis and get clarity on implementation strategies."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img
              src="/video-analysis.jpg"
              alt="Video Analysis Demo"
              className="w-full h-auto max-w-[400px] rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Professional Video Analysis
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get detailed technique feedback through our comprehensive video analysis system. 
              Upload your jumps and receive frame-by-frame breakdown with actionable improvements.
            </p>
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className={`${feature.icon} text-primary text-xl`}></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button>Try Video Analysis</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAnalysis;
