
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
        console.log('Fetching Printful products...');
        
        const response = await printful.getProducts();
        console.log('Raw Printful API response:', response);
        
        if (response.result) {
          // Filter out products without variants or without proper data
          const validProducts = response.result.filter(
            product => product && product.sync_variants && product.sync_variants.length > 0
          );
          console.log('Filtered Printful products count:', validProducts.length);
          setProducts(validProducts);
          
          if (validProducts.length === 0) {
            console.log('No valid products found. Check if products have sync_variants.');
          }
        } else {
          console.error('No result found in Printful response:', response);
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

  const handleSelectVariant = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const handleAddToCart = (product: any) => {
    if (!selectedVariants[product.id]) {
      toast.error(`Please select a variant for ${product.name}`);
      return;
    }

    const selectedVariantId = selectedVariants[product.id];
    const variant = product.sync_variants.find((v: any) => v.id === selectedVariantId);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <div className="aspect-square w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full" />
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
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="text-red-500 mb-4 text-xl">
          <i className="ri-error-warning-line text-3xl"></i>
        </div>
        <h3 className="font-semibold text-lg mb-2">Error Loading Products</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <p className="text-sm text-gray-500 max-w-md">
          Please verify that your Printful API key is correctly configured in Supabase and 
          that you have products set up in your Printful store.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="text-amber-500 mb-4 text-xl">
          <i className="ri-store-2-line text-3xl"></i>
        </div>
        <h3 className="font-semibold text-lg mb-2">No Products Found</h3>
        <p className="text-gray-500 mb-6">No products were found in your Printful store.</p>
        <p className="text-sm text-gray-500 max-w-md">
          Please make sure you have added products in your Printful dashboard and that they have been properly synchronized.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
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
                  value={selectedVariants[product.id] || ""} 
                  onValueChange={(value) => handleSelectVariant(product.id, value)}
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
              onClick={() => handleAddToCart(product)}
              disabled={product.sync_variants?.length > 1 && !selectedVariants[product.id]}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PrintfulProducts;
