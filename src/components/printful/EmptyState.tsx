
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-gray-300 rounded-lg bg-white">
      <div className="text-amber-500 mb-4">
        <i className="ri-store-2-line text-5xl"></i>
      </div>
      <h3 className="font-semibold text-xl mb-3">No Printful Products Found</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        Your Printful store is connected, but no synchronized products were found. You'll need to add products in your Printful dashboard.
      </p>
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => window.open('https://www.printful.com/dashboard/sync', '_blank')}
        >
          <ExternalLink size={16} />
          Go to Printful Dashboard
        </Button>
        <p className="text-sm text-gray-500">
          After adding products, they'll appear here automatically.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
