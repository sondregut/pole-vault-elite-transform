
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterButtonsProps {
  categories: readonly string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterButtons = ({ categories, activeCategory, onCategoryChange }: FilterButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="transition-all duration-200"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;
