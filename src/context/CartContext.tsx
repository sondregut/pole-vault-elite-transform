
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  option?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, option?: string) => void;
  updateQuantity: (id: number, quantity: number, option?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart (with same option if applicable)
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && (!item.option || i.option === item.option)
      );

      if (existingItemIndex > -1) {
        // If item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success(`${item.name} quantity updated in cart`);
        return updatedItems;
      } else {
        // If item doesn't exist, add to cart
        toast.success(`${item.name} added to cart`);
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id: number, option?: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(
        item => !(item.id === id && (!option || item.option === option))
      );
      return updatedItems;
    });
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id: number, quantity: number, option?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, option);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id && (!option || item.option === option)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Convert price string (e.g. "$49.99") to number
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
