
import { Button } from "@/components/ui/button";

const VideoAnalysis = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="/video-analysis.jpg"
                alt="Video Analysis Demo"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center ml-1">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white ml-1"
                    >
                      <polygon points="5 3 19 12 5 21" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Professional Video Analysis
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Get detailed technique feedback through our comprehensive video analysis system. Upload your jumps and receive frame-by-frame breakdown with actionable improvements.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-primary">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Video Uploads</h4>
                <p className="text-gray-600">
                  Upload your jumps directly through TrainHeroic or send them via email - whatever works best for you.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-primary">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analysis</h4>
                <p className="text-gray-600">
                  Receive comprehensive feedback with drawn annotations, slow-motion breakdown, and specific cues for improvement.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-primary">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Follow-up Consultation</h4>
                <p className="text-gray-600">
                  Schedule a video call to discuss the analysis and get clarity on implementation strategies.
                </p>
              </div>
            </div>
            
            <Button>Try Video Analysis</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAnalysis;
