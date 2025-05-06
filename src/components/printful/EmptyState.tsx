
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="text-amber-500 mb-4 text-xl">
        <i className="ri-store-2-line text-3xl"></i>
      </div>
      <h3 className="font-semibold text-lg mb-2">No Products Found</h3>
      <p className="text-gray-500 mb-6">No products were found in your Printful store.</p>
      <p className="text-sm text-gray-500 max-w-md">
        Please make sure you have added products in your Printful dashboard and that they have been properly synchronized.
      </p>
    </div>
  );
};

export default EmptyState;
