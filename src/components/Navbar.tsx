
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { user, isLoading } = useUser();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center font-bold text-lg">
            Pole Vault Digital
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/video-library" className="text-gray-600 hover:text-primary transition-colors">
              Video Library
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/drills" className="text-gray-600 hover:text-primary transition-colors">
              Drills
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                  <span className="sr-only">Toggle Cart</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>My Cart</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cartItems.length === 0 ? (
                  <DropdownMenuItem className="text-center">Cart is empty</DropdownMenuItem>
                ) : (
                  cartItems.map((item) => (
                    <DropdownMenuItem key={item.id} className="flex justify-between">
                      {item.name} x {item.quantity}
                      <span className="font-bold">${item.price}</span>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/cart")}>View Cart</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isLoading && (
              user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
