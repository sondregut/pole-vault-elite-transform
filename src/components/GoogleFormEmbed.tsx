
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const GoogleFormEmbed = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary text-white hover:bg-primary-dark rounded-button">
          Apply for Coaching
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSdcVhfxGSURY6myn9TsDFcfndfbg2hcivdYtsnKmjHsXzwmsw/viewform?embedded=true" 
          width="100%" 
          height="500" 
          frameBorder={0} 
          marginHeight={0} 
          marginWidth={0}
          title="Coaching Application Form"
          className="shadow-md"
        >
          Loading…
        </iframe>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleFormEmbed;
