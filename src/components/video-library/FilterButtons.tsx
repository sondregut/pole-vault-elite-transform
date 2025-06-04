
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
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`
            px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 
            ${activeCategory === category 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
