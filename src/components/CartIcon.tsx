
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import CartSheet from "./CartSheet";

const CartIcon = () => {
  const { getItemCount, showCartSheet, setShowCartSheet } = useCart();
  const itemCount = getItemCount();

  return (
    <>
      <Link to="/cart">
        <Button variant="ghost" className="relative p-2">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </Link>
      
      <CartSheet 
        isOpen={showCartSheet} 
        onClose={() => setShowCartSheet(false)} 
      />
    </>
  );
};

export default CartIcon;
