
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video, FileText, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VideoUploadHelper: React.FC = () => {
  const supportedFormats = [
    { format: "MP4", description: "Most compatible, recommended" },
    { format: "WebM", description: "Web-optimized format" },
    { format: "MOV", description: "QuickTime format" },
    { format: "QuickTime", description: "Apple format" }
  ];

  const uploadSteps = [
    {
      icon: <Database className="h-5 w-5" />,
      title: "Access Supabase Storage",
      description: "Go to your Supabase project dashboard → Storage → video-library bucket"
    },
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload Video Files",
      description: "Drag and drop your video files or click to browse and upload"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Add Video Records",
      description: "Add corresponding records to the 'videos' table with file paths and metadata"
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: "Videos Appear Here",
      description: "Uploaded videos will automatically appear in the video library"
    }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Video Upload Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Supported Formats */}
        <div>
          <h3 className="font-semibold mb-3">Supported Video Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supportedFormats.map((format, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Badge variant="secondary" className="mb-1">{format.format}</Badge>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Steps */}
        <div>
          <h3 className="font-semibold mb-3">How to Add Videos</h3>
          <div className="space-y-4">
            {uploadSteps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h4 className="font-medium">{step.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Button */}
        <div className="text-center pt-4 border-t">
          <Button 
            onClick={() => window.open('https://supabase.com/dashboard/project/qmasltemgjtbwrwscxtj/storage/buckets/video-library', '_blank')}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Open Supabase Storage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUploadHelper;
