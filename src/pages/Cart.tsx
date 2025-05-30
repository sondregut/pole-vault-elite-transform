
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FreeDownloadForm from "@/components/FreeDownloadForm";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, storePurchaseInfo } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFreeDownloadForm, setShowFreeDownloadForm] = useState(false);
  const [freeProduct, setFreeProduct] = useState<any>(null);
  const navigate = useNavigate();
  const cartTotal = getCartTotal();

  // Check if cart contains only free products
  const hasFreeProductsOnly = cartItems.length > 0 && cartTotal === 0;
  const hasPaidProducts = cartTotal > 0;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // If cart has only free products, show download form for the first free product
    if (hasFreeProductsOnly) {
      const firstFreeProduct = cartItems.find(item => parseFloat(item.price.replace('$', '')) === 0);
      if (firstFreeProduct) {
        setFreeProduct(firstFreeProduct);
        setShowFreeDownloadForm(true);
        return;
      }
    }

    // Store purchase info before processing paid products
    storePurchaseInfo();

    setIsProcessing(true);

    try {
      // Convert cart items to the format expected by the create-checkout function
      const lineItems = cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        option: item.option,
        image: item.image
      }));

      // Call the Supabase Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { lineItems, successUrl: window.location.origin + '/checkout/success', cancelUrl: window.location.origin + '/checkout/cancel' }
      });

      if (error) throw error;
      
      // Redirect to Stripe Checkout in the same window (not new tab)
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session");
      setIsProcessing(false);
    }
  };

  const handleFreeDownloadSuccess = () => {
    setShowFreeDownloadForm(false);
    setFreeProduct(null);
    clearCart(false);
    toast.success("Download completed! Check your downloads folder.");
  };

  const getFreeDownloadUrl = (productId: number) => {
    if (productId === 13) { // Best Pole Vault Drills
      return "https://qmasltemgjtbwrwscxtj.supabase.co/storage/v1/object/public/digital-products/BEST%20POLE%20VAULT%20DRILLS%20Sondre.pdf";
    }
    return "";
  };

  const getFreeDownloadFileName = (productId: number) => {
    if (productId === 13) { // Best Pole Vault Drills
      return "Best Pole Vault Drills.pdf";
    }
    return "download.pdf";
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-lg mb-6">Your cart is empty</p>
              <Link to="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (showFreeDownloadForm && freeProduct) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold mb-2">Free Download</h1>
                <p className="text-gray-600">
                  Get your free {freeProduct.name} by entering your details below
                </p>
              </div>
              
              <FreeDownloadForm
                productId={freeProduct.id}
                productName={freeProduct.name}
                onSuccess={handleFreeDownloadSuccess}
                downloadUrl={getFreeDownloadUrl(freeProduct.id)}
                fileName={getFreeDownloadFileName(freeProduct.id)}
              />
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowFreeDownloadForm(false);
                    setFreeProduct(null);
                  }}
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Items ({cartItems.length})</h2>
                </div>
                <ul className="divide-y">
                  {cartItems.map((item) => (
                    <li key={`${item.id}-${item.option || ''}`} className="p-4 flex items-center">
                      <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.option && <p className="text-sm text-gray-500">Option: {item.option}</p>}
                        <p className="text-primary font-semibold">{item.price}</p>
                        <div className="flex items-center mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.option)}
                            className="p-1 rounded-full border hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1, item.option)}
                            className="w-14 mx-2 text-center"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.option)}
                            className="p-1 rounded-full border hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.option)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Remove item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t">
                  <Button variant="outline" onClick={() => clearCart(true)} className="text-gray-500">
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {hasFreeProductsOnly && (
                  <div className="mb-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-700">
                      🎉 This is a free download! Click below to get it.
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full mb-4" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : hasFreeProductsOnly ? "Get Free Download" : "Proceed to Checkout"}
                </Button>
                <Link to="/shop">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
