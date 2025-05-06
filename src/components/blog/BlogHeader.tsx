
import React from 'react';

const BlogHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-secondary">
          G-Force Training Blog
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Insights, tips, and training advice from elite pole vaulter and coach Sondre Guttormsen
          to elevate your training and performance.
        </p>
      </div>
    </div>
  );
};

export default BlogHeader;
