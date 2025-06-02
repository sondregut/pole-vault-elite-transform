
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VideoFiltersProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

const commonTags = [
  "beginner", "intermediate", "advanced", "technique", "power", "speed", 
  "flexibility", "strength", "coordination", "balance", "progression"
];

const commonEquipment = [
  "pole", "mat", "runway", "dumbbells", "medicine ball", "resistance bands", 
  "barbell", "pull-up bar", "foam roller", "hurdles"
];

const VideoFilters: React.FC<VideoFiltersProps> = ({
  sortBy,
  onSortChange,
  selectedTags,
  onTagsChange,
  selectedEquipment,
  onEquipmentChange
}) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    if (selectedEquipment.includes(equipment)) {
      onEquipmentChange(selectedEquipment.filter(e => e !== equipment));
    } else {
      onEquipmentChange([...selectedEquipment, equipment]);
    }
  };

  const clearAllFilters = () => {
    onTagsChange([]);
    onEquipmentChange([]);
    onSortChange("created_at");
  };

  return (
    <div className="space-y-4">
      {/* Sort */}
      <div>
        <label className="text-sm font-medium mb-2 block">Sort By</label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
            <SelectItem value="view_count">Most Viewed</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Filter by Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Equipment Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Filter by Equipment</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonEquipment.map((equipment) => (
            <Badge
              key={equipment}
              variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleEquipmentToggle(equipment)}
            >
              {equipment}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedTags.length > 0 || selectedEquipment.length > 0) && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearAllFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default VideoFilters;
