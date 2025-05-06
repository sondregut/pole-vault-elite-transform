
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [hasDigitalProducts, setHasDigitalProducts] = useState(false);
  const [hasJumpersKneeProtocol, setHasJumpersKneeProtocol] = useState(false);
  
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
      }
    };
    
    checkDigitalProducts();
  }, [clearCart]);

  const handleDirectDownload = () => {
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
                  onClick={handleDirectDownload}
                  className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                >
                  Download Jumpers Knee Protocol PDF
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
              <Link to="/shop">
                <Button className="w-full" variant={hasDigitalProducts ? "outline" : "default"}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutSuccess;
