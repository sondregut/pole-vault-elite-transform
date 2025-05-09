
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PVT = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">PVT</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              This is the PVT page content. Add your specific content here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PVT;
