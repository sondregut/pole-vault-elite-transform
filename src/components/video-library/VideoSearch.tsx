
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface VideoSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const VideoSearch: React.FC<VideoSearchProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search videos by title, description, or tags..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default VideoSearch;
