
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FreeDownloadFormProps {
  productId: number;
  productName: string;
  onSuccess: () => void;
  downloadUrl: string;
  fileName: string;
}

const FreeDownloadForm = ({ 
  productId, 
  productName, 
  onSuccess, 
  downloadUrl, 
  fileName 
}: FreeDownloadFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store the free download submission in the database
      const { error: dbError } = await supabase
        .from('free_download_submissions')
        .insert({
          product_id: productId,
          product_name: productName,
          name: formData.name,
          email: formData.email,
          downloaded_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Don't block the download for database errors, just log it
      }

      // Start the download immediately
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`${fileName} download started! Check your downloads folder.`);
      onSuccess();
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to start download. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Get Your Free Download</CardTitle>
        <p className="text-center text-gray-600 text-sm">
          Enter your details to download {productName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download {productName}
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            We'll only use your email to send you valuable pole vault tips and updates. 
            You can unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreeDownloadForm;
