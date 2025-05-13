
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        
        <Tabs defaultValue="tab1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card>
              <CardHeader>
                <CardTitle>Test Component - Tab 1</CardTitle>
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
          </TabsContent>
          <TabsContent value="tab2">
            <Card>
              <CardHeader>
                <CardTitle>Test Component - Tab 2</CardTitle>
                <CardDescription>
                  This is the second tab content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This tab shows how to properly implement the Tabs component structure
                  with TabsContent inside a Tabs container.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Test;
