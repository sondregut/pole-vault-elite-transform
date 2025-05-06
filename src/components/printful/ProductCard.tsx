import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number | string;
  images?: string[];
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleViewDetails = () => {
    navigate(`/shop/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = () => {
    setLoading(true);
    
    // Process the price correctly based on the type
    const price = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : product.price;
    
    const cartItem = {
      ...product,
      price: price, // This will now always be a number
      quantity: 1,
    };

    setTimeout(() => {
      addToCart(cartItem);
      setLoading(false);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }, 600);
  };

  // Fix the price display to always display a number formatted as currency
  const formattedPrice = typeof product.price === 'string'
    ? `$${parseFloat(product.price).toFixed(2)}`
    : `$${product.price.toFixed(2)}`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div 
        className="h-48 bg-gray-100 overflow-hidden cursor-pointer"
        onClick={handleViewDetails}
      >
        <img 
          src={product.images?.[0] || "placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-medium text-lg line-clamp-2 cursor-pointer hover:text-primary transition"
            onClick={handleViewDetails}
          >
            {product.name}
          </h3>
          <Badge variant="secondary" className="ml-2 whitespace-nowrap">
            {formattedPrice}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {product.description || "No description available"}
        </p>
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
