
import React from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Test = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Welcome to the Test Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is a simple welcome screen with minimal code as requested.
          </p>
        </div>
        
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle>Test Component</CardTitle>
            <CardDescription>A simple card component using shadcn/ui</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This is a minimal test page to demonstrate React components.</p>
            <Button>Click Me</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test;
