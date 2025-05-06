
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();
  const [hasDigitalProducts, setHasDigitalProducts] = useState(false);
  
  // Clear the cart when successfully checked out
  useEffect(() => {
    clearCart();
    
    // Check if the user has digital products
    const checkDigitalProducts = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        const { data } = await supabase
          .from('user_downloads')
          .select('id')
          .eq('user_id', session.session.user.id)
          .limit(1);
          
        setHasDigitalProducts(data && data.length > 0);
      }
    };
    
    checkDigitalProducts();
  }, [clearCart]);
  
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
