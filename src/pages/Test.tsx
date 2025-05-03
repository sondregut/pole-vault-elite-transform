
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Test = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto text-center py-16">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Test Page</h1>
          <p className="text-xl text-gray-600">This is a simple welcome screen.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Test;
