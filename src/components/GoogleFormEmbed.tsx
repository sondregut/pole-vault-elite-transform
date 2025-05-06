
import React from 'react';

const GoogleFormEmbed = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Apply for Coaching</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSdcVhfxGSURY6myn9TsDFcfndfbg2hcivdYtsnKmjHsXzwmsw/viewform?embedded=true" 
              width="100%" 
              height="3341" 
              frameBorder="0" 
              marginHeight="0" 
              marginWidth="0"
              title="Coaching Application Form"
              className="shadow-md"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleFormEmbed;
