
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, RotateCcw, Dumbbell, Zap, Circle, Move, Video, Trophy } from "lucide-react";
import { VideoCategory } from "@/hooks/useVideoLibrary";

interface CategoryNavigationProps {
  categories: VideoCategory[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategory: string | null) => void;
}

const getIconComponent = (iconName: string | null) => {
  const icons = {
    target: Target,
    "rotate-3d": RotateCcw,
    dumbbell: Dumbbell,
    zap: Zap,
    circle: Circle,
    move: Move,
    video: Video,
    trophy: Trophy
  };
  
  const IconComponent = iconName ? icons[iconName as keyof typeof icons] : Target;
  return IconComponent || Target;
};

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect
}) => {
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="mb-8">
      {/* Main Categories */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => {
              onCategorySelect(null);
              onSubcategorySelect(null);
            }}
            className="mb-2"
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => {
                  onCategorySelect(category.id);
                  onSubcategorySelect(null);
                }}
                className="mb-2 flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Subcategories */}
      {selectedCategoryData?.subcategories && selectedCategoryData.subcategories.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">{selectedCategoryData.name} - Subcategories</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedSubcategory === null ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => onSubcategorySelect(null)}
            >
              All {selectedCategoryData.name}
            </Badge>
            {selectedCategoryData.subcategories.map((subcategory) => (
              <Badge
                key={subcategory.id}
                variant={selectedSubcategory === subcategory.name ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => onSubcategorySelect(subcategory.name)}
              >
                {subcategory.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryNavigation;
