
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Test = () => {
  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Test Page</h1>
          <p className="text-gray-600 text-lg">
            This is a simple demonstration page with minimal content.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Component</CardTitle>
            <CardDescription>
              This is a basic card component from the shadcn/ui library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This page demonstrates a minimal React component setup. You can use this
              as a template for building more complex pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test;
