
import React from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface DownloadCardProps {
  id: string;
  fileId: string;
  fileName: string;
  fileType: string;
  downloadCount: number;
  downloadedAt: string | null;
  onDownload: (fileId: string, fileName: string) => Promise<void>;
}

const DownloadCard: React.FC<DownloadCardProps> = ({
  id,
  fileId,
  fileName,
  fileType,
  downloadCount,
  downloadedAt,
  onDownload,
}) => {
  return (
    <Card key={id} className="overflow-hidden">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <FileText className="text-primary" />
        </div>
        <CardTitle>{fileName}</CardTitle>
        <CardDescription>
          {fileType.toUpperCase()} File
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Downloaded {downloadCount || 0} times
        </p>
        {downloadedAt && (
          <p className="text-sm text-gray-500">
            Last downloaded: {new Date(downloadedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onDownload(fileId, fileName)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DownloadCard;
