
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const BlogHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-24">
      <div className="container mx-auto text-center px-4">
        <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-4 md:mb-6 text-secondary`}>
          G-Force Training Blog
        </h1>
        {!isMobile && (
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and training advice from elite pole vaulter and coach Sondre Guttormsen
            to elevate your training and performance.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogHeader;
