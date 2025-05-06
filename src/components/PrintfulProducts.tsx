
import React, { useEffect, useState } from 'react';
import { printful } from '@/integrations/printful/client';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const PrintfulProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchPrintfulProducts() {
      try {
        setLoading(true);
        const response = await printful.getProducts();
        
        if (response.result) {
          // Filter out products without variants or without proper data
          const validProducts = response.result.filter(
            product => product && product.sync_variants && product.sync_variants.length > 0
          );
          setProducts(validProducts);
          console.log('Fetched Printful products:', validProducts);
        } else {
          setError("Could not fetch products from Printful");
        }
      } catch (err) {
        console.error("Error fetching Printful products:", err);
        setError("Failed to load products from Printful");
      } finally {
        setLoading(false);
      }
    }

    fetchPrintfulProducts();
  }, []);

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const handleAddToCart = (product: any, variantId?: string) => {
    try {
      // Safely check if product has variants
      if (!product || !product.sync_variants || product.sync_variants.length === 0) {
        toast.error("Product data is invalid");
        return;
      }

      // Find the selected variant
      const selectedVariant = product.sync_variants.find(
        (v: any) => v && v.id === Number(variantId)
      );
      
      if (!selectedVariant && product.sync_variants.length > 1) {
        toast.error(`Please select a variant for ${product.name}`);
        return;
      }
      
      // If no variant is selected but there is only one variant, use that
      const variant = selectedVariant || product.sync_variants[0];

      if (!variant) {
        toast.error("Could not find a valid product variant");
        return;
      }
      
      // Find a valid preview image
      const previewFile = variant.files && variant.files.find((f: any) => f && f.type === "preview");
      const previewUrl = previewFile ? previewFile.preview_url : null;
      
      // Add to cart with safe fallbacks
      addToCart({
        id: variant.id, // Use variant ID as the cart item ID
        name: `${product.name} - ${variant.name}`,
        price: (variant.retail_price || "0").toString(),
        image: previewUrl || product.thumbnail_url || "/placeholder.svg",
        quantity: 1,
        option: variant.name
      });
      
      toast.success(`${product.name} - ${variant.name} added to cart`);
    } catch (err) {
      console.error("Error adding Printful product to cart:", err);
      toast.error("Failed to add product to cart");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden h-full flex flex-col">
            <div className="aspect-square w-full overflow-hidden relative">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        No products available from Printful at this time.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        // Skip rendering products with missing or invalid data
        if (!product || !product.sync_variants || product.sync_variants.length === 0) {
          return null;
        }
        
        // Safely access product data with fallbacks
        const productName = product.name || "Unnamed Product";
        const thumbnail = product.thumbnail_url || "/placeholder.svg";
        const productId = product.id?.toString() || "";
        const firstVariant = product.sync_variants[0] || {};
        const price = firstVariant.retail_price || "Price unavailable";
        const description = product.sync_product?.description || "Custom printed product";
        
        return (
          <Card key={productId} className="overflow-hidden h-full flex flex-col">
            <div className="cursor-pointer group flex flex-col flex-grow">
              <div className="aspect-square w-full overflow-hidden relative">
                <img
                  src={thumbnail}
                  alt={productName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                {product.is_new && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 font-bold">
                    NEW
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="font-medium group-hover:text-primary transition-colors">
                  {productName}
                </div>
                <div className="text-lg font-semibold">
                  {price}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {product.sync_variants.length > 1 && (
                  <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Select Option
                    </label>
                    <Select
                      value={selectedVariants[productId] || ""}
                      onValueChange={(value) => handleVariantChange(productId, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose option" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sync_variants.map((variant: any) => {
                          // Add extra safety check for variant
                          if (!variant || !variant.id) return null;
                          return (
                            <SelectItem key={variant.id} value={variant.id.toString()}>
                              {variant.name} - {variant.retail_price}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {description}
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleAddToCart(product, selectedVariants[productId])}
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PrintfulProducts;
