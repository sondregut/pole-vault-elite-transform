
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const SubmissionThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="section-padding py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Thank You for Your Submission!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Your video submission has been received and is now under review.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">
                    Expect a review within 24-48 hours
                  </span>
                </div>
                
                <p className="text-gray-600">
                  We'll notify you via email once your submission has been reviewed. 
                  You can also check the status of your submissions on the upload page.
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => navigate('/upload')}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Upload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SubmissionThankYou;
