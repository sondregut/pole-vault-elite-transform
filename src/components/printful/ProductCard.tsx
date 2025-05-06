
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: any;
  selectedVariant: string | undefined;
  onSelectVariant: (variantId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, selectedVariant, onSelectVariant }) => {
  const { addToCart } = useCart();

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

    addToCart({
      id: `printful-${product.id}-${variant.id}`,
      name: `${product.name} - ${variant.name}`,
      price: parseFloat(variant.retail_price),
      image: variant.files?.find((f: any) => f.type === 'preview')?.preview_url || product.thumbnail_url,
      quantity: 1,
      printfulData: {
        productId: product.id,
        variantId: variant.id
      }
    });

    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <Card key={product.id} className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.thumbnail_url || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover"
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
          className="w-full"
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
