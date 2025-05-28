
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

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

    setIsSubmitting(true);
    
    try {
      // Start the download immediately - no database storage required for free downloads
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
