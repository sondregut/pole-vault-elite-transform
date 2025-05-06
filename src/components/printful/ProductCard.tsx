
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: any;
  selectedVariant: string | undefined;
  onSelectVariant: (variantId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, selectedVariant, onSelectVariant }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error(`Please select a variant for ${product.name}`);
      return;
    }

    const variant = product.sync_variants.find((v: any) => v.id === selectedVariant);

    if (!variant) {
      toast.error("Selected variant not found");
      return;
    }

    // Add item to cart - convert the retail price string to a number
    const priceAsString = variant.retail_price || "0"; 
    const priceAsNumber = typeof priceAsString === 'string' ? 
      parseFloat(priceAsString.replace(/[^0-9.]/g, '')) : 
      Number(priceAsString);
    
    addToCart({
      id: `printful-${product.id}-${variant.id}`,
      name: `${product.name} - ${variant.name}`,
      price: priceAsNumber, // Now correctly typed as number
      image: variant.files?.find((f: any) => f.type === 'preview')?.preview_url || product.thumbnail_url,
      quantity: 1,
      printfulData: {
        productId: product.id,
        variantId: variant.id
      }
    });

    // Instead of showing a toast, we'll show the confirmation UI
    showAddedToCartPopup(`${product.name} - ${variant.name}`);
  };

  // Function to show the added to cart popup using Sonner toast with custom UI
  const showAddedToCartPopup = (productName: string) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-md w-full">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Added to Cart!</h3>
            <p className="text-sm text-gray-500 mt-1">{productName} has been added to your cart</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toast.dismiss(t)}
          >
            Continue Shopping
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              toast.dismiss(t);
              navigate('/cart');
            }}
            className="flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            View Cart
          </Button>
        </div>
      </div>
    ), {
      duration: 5000, // Show for 5 seconds
    });
  };

  return (
    <Card key={product.id} className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.thumbnail_url || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg">{product.name}</h3>
        {product.sync_variants && product.sync_variants[0] && (
          <div className="text-lg font-semibold">
            {product.sync_variants[0].retail_price}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {product.sync_variants && product.sync_variants.length > 1 && (
          <div className="mb-4">
            <Select 
              value={selectedVariant || ""} 
              onValueChange={(value) => onSelectVariant(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {product.sync_variants.map((variant: any) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.name} - {variant.retail_price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
          onClick={handleAddToCart}
          disabled={product.sync_variants?.length > 1 && !selectedVariant}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
