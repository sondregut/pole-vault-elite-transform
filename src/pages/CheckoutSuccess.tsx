
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, FileDown, CheckCircle, ExternalLink } from "lucide-react";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [hasDigitalProducts, setHasDigitalProducts] = useState(false);
  const [hasJumpersKneeProtocol, setHasJumpersKneeProtocol] = useState(false);
  const [hasPoleVaultDrills, setHasPoleVaultDrills] = useState(false);
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  
  // Only clear cart if there's a session_id parameter (indicating successful Stripe checkout)
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    // Only clear cart if we have a session ID from Stripe, and don't show toast
    if (sessionId) {
      clearCart(false);
    }
    
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
  }, [clearCart, searchParams]);

  const handleDownload = (type: string) => {
    setIsDownloading(prev => ({ ...prev, [type]: true }));
    
    let pdfUrl = '';
    let fileName = '';
    
    if (type === 'jumpersKnee') {
      pdfUrl = "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/sign/digital-products/Jumper%20Knee%20Protocol%20.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2JjMzRiYWRlLTQ0YjQtNGU2Zi05ZDdlLTAwMjRlOGU0MGI1YyJ9.eyJ1cmwiOiJkaWdpdGFsLXByb2R1Y3RzL0p1bXBlciBLbmVlIFByb3RvY29sIC5wZGYiLCJpYXQiOjE3NDY1MDExMzksImV4cCI6MjA2MTg2MTEzOX0.VReJcr2d90Av7LHa31owYY-q8fk-6DDP5whzq3-7HmM";
      fileName = "Jumpers Knee Protocol.pdf";
    } else if (type === 'poleVaultDrills') {
      pdfUrl = "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/sign/digital-products/BEST%20POLE%20VAULT%20DRILLS%20Sondre.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2JjMzRiYWRlLTQ0YjQtNGU2Zi05ZDdlLTAwMjRlOGU0NGI1YyJ9.eyJ1cmwiOiJkaWdpdGFsLXByb2R1Y3RzL0JFU1QgUE9MRSBWQVVMVCBEUklMTFMgU29uZHJlLnBkZiIsImlhdCI6MTc0NjUwMTQ5NiwiZXhwIjoyMDYxODYxNDk2fQ.Hg8Uob-9MeKRkjlsLqp937w2yYb3PCiNwB8lHn41Cnw";
      fileName = "Best Pole Vault Drills.pdf";
    }
    
    // Create a hidden anchor element and click it
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Add event listeners to track download completion
    a.addEventListener('error', () => {
      toast.error(`Failed to download ${fileName}. Please try again.`);
      setIsDownloading(prev => ({ ...prev, [type]: false }));
      document.body.removeChild(a);
    });
    
    // Use timeout as a fallback since download success isn't reliably detectable
    setTimeout(() => {
      setIsDownloading(prev => ({ ...prev, [type]: false }));
      toast.success(`${fileName} download initiated`);
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 3000);
    
    a.click();
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Flight Mode - 10 Week Pole Vault Program",
      price: "$59",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//flight%20mode.jpeg",
      description: "Complete 10-week pole vault training program with drills, sprint work, and lifting.",
      link: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1733159932"
    },
    {
      id: 1,
      name: "Power Strength - 10 Week Weight Lifting Program",
      price: "$39",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//weights.jpeg",
      description: "Strength-focused program with Olympic lifts and compound movements.",
      link: "https://marketplace.trainheroic.com/account/login?team=guttormsen-program-1735674214"
    },
    {
      id: 3,
      name: "Jumpers Knee Rehab Protocol",
      price: "$19",
      image: "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/website-photos//jumpers%20knee.png",
      description: "Complete rehabilitation protocol for jumper's knee recovery.",
      link: "/shop/product/3"
    }
  ];
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                  onClick={() => handleDownload('jumpersKnee')}
                  className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                  disabled={isDownloading['jumpersKnee']}
                >
                  {isDownloading['jumpersKnee'] ? (
                    <>Downloading...</>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download Jumpers Knee Protocol PDF
                    </>
                  )}
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
                  onClick={() => handleDownload('poleVaultDrills')}
                  className="w-full mb-3 bg-green-600 hover:bg-green-700"
                  disabled={isDownloading['poleVaultDrills']}
                >
                  {isDownloading['poleVaultDrills'] ? (
                    <>Downloading...</>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download Best Pole Vault Drills PDF
                    </>
                  )}
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
              
              {/* Free product download - simplified without form */}
              <Button 
                onClick={() => handleDownload("poleVaultDrills")} 
                className="w-full mb-3 bg-primary text-white flex items-center justify-center gap-2"
                disabled={isDownloading['poleVaultDrills']}
              >
                {isDownloading['poleVaultDrills'] ? (
                  "Downloading..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Free Pole Vault Drills
                  </>
                )}
              </Button>
              
              <Link to="/shop">
                <Button className="w-full" variant={hasDigitalProducts ? "outline" : "default"}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* You May Also Like Section */}
          {(hasPoleVaultDrills || !hasDigitalProducts) && (
            <div className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">You May Also Like</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-bold text-lg">{product.price}</span>
                        {product.link.startsWith('http') ? (
                          <Button asChild size="sm">
                            <a href={product.link} target="_blank" rel="noopener noreferrer">
                              View Program
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <Button asChild size="sm">
                            <Link to={product.link}>
                              View Details
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutSuccess;
