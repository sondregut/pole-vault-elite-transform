
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema for validation
const downloadFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type DownloadFormValues = z.infer<typeof downloadFormSchema>;

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [hasDigitalProducts, setHasDigitalProducts] = useState(false);
  const [hasJumpersKneeProtocol, setHasJumpersKneeProtocol] = useState(false);
  const [hasPoleVaultDrills, setHasPoleVaultDrills] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<string>("");
  
  // Form definition
  const form = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  
  // Clear the cart when successfully checked out
  useEffect(() => {
    clearCart();
    
    // Check if the user has digital products
    const checkDigitalProducts = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const userId = session.session.user.id;
        
        // Check for any digital products
        const { data: downloads } = await supabase
          .from('user_downloads')
          .select('id, product_files(product_id)')
          .eq('user_id', userId);
          
        setHasDigitalProducts(downloads && downloads.length > 0);
        
        // Check specifically for Jumpers Knee Protocol (product ID 3)
        const hasJumpersKnee = downloads?.some(
          download => download.product_files?.product_id === 3
        );
        
        setHasJumpersKneeProtocol(hasJumpersKnee);

        // Check specifically for Pole Vault Drills (product ID 13)
        const hasPoleVaultDrills = downloads?.some(
          download => download.product_files?.product_id === 13
        );
        
        setHasPoleVaultDrills(hasPoleVaultDrills);
      }
    };
    
    checkDigitalProducts();
  }, [clearCart]);

  const handleJumpersKneeDownload = () => {
    const pdfUrl = "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/sign/digital-products/Jumper%20Knee%20Protocol%20.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2JjMzRiYWRlLTQ0YjQtNGU2Zi05ZDdlLTAwMjRlOGU0MGI1YyJ9.eyJ1cmwiOiJkaWdpdGFsLXByb2R1Y3RzL0p1bXBlciBLbmVlIFByb3RvY29sIC5wZGYiLCJpYXQiOjE3NDY1MDExMzksImV4cCI6MjA2MTg2MTEzOX0.VReJcr2d90Av7LHa31owYY-q8fk-6DDP5whzq3-7HmM";
    
    // Create a hidden anchor element and click it
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = "Jumpers Knee Protocol.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Jumpers Knee Protocol PDF downloaded successfully");
  };

  // Open the download dialog
  const openDownloadDialog = (type: string) => {
    setDownloadType(type);
    setDownloadDialogOpen(true);
  };

  // Process download after form submission
  const onSubmitDownloadForm = async (data: DownloadFormValues) => {
    try {
      // Store customer information in the waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email: data.email,
          metadata: {
            firstName: data.firstName,
            lastName: data.lastName,
            product: "Best Pole Vault Drills"
          }
        }]);

      if (error) throw error;
      
      // Close the dialog
      setDownloadDialogOpen(false);
      
      // Download the PDF based on type
      downloadPoleVaultDrillsPDF();
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error processing download:", error);
      toast.error("There was an error processing your download. Please try again.");
    }
  };

  const downloadPoleVaultDrillsPDF = () => {
    // Updated URL for the Pole Vault Drills PDF
    const pdfUrl = "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/sign/digital-products/BEST%20POLE%20VAULT%20DRILLS%20Sondre.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2JjMzRiYWRlLTQ0YjQtNGU2Zi05ZDdlLTAwMjRlOGU0MGI1YyJ9.eyJ1cmwiOiJkaWdpdGFsLXByb2R1Y3RzL0JFU1QgUE9MRSBWQVVMVCBEUklMTFMgU29uZHJlLnBkZiIsImlhdCI6MTc0NjUwMTQ5NiwiZXhwIjoyMDYxODYxNDk2fQ.Hg8Uob-9MeKRkjlsLqp937w2yYb3PCiNwB8lHn41Cnw";
    
    // Create a hidden anchor element and click it
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = "Best Pole Vault Drills.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Best Pole Vault Drills PDF downloaded successfully");
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is now being processed.
            </p>
            
            {hasJumpersKneeProtocol && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <h2 className="text-lg font-medium text-blue-800 mb-2">Jumpers Knee Protocol</h2>
                <p className="text-blue-700 mb-3">
                  Your Jumpers Knee Protocol PDF is now ready for download.
                </p>
                <Button 
                  onClick={handleJumpersKneeDownload}
                  className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                >
                  Download Jumpers Knee Protocol PDF
                </Button>
              </div>
            )}

            {hasPoleVaultDrills && (
              <div className="mb-6 p-4 bg-green-50 rounded-md">
                <h2 className="text-lg font-medium text-green-800 mb-2">Best Pole Vault Drills</h2>
                <p className="text-green-700 mb-3">
                  Your Best Pole Vault Drills PDF is now ready for download.
                </p>
                <Button 
                  onClick={downloadPoleVaultDrillsPDF}
                  className="w-full mb-3 bg-green-600 hover:bg-green-700"
                >
                  Download Best Pole Vault Drills PDF
                </Button>
              </div>
            )}
            
            <div className="space-y-3">
              {hasDigitalProducts && (
                <Link to="/downloads">
                  <Button className="w-full mb-3">
                    Access Your Downloads
                  </Button>
                </Link>
              )}
              
              {/* Free product download option with form */}
              <Button 
                onClick={() => openDownloadDialog("poleVaultDrills")} 
                className="w-full mb-3 bg-primary text-white"
              >
                Download Free Pole Vault Drills
              </Button>
              
              <Link to="/shop">
                <Button className="w-full" variant={hasDigitalProducts ? "outline" : "default"}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download form dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Your Free PDF</DialogTitle>
            <DialogDescription>
              Enter your information below to download the free Best Pole Vault Drills PDF.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitDownloadForm)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">Download PDF</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default CheckoutSuccess;
