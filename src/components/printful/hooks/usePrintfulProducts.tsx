
import { useState, useEffect } from 'react';
import { printful } from '@/integrations/printful/client';

export const usePrintfulProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

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

  return {
    products,
    loading,
    error,
    selectedVariants,
    handleSelectVariant
  };
};

export default usePrintfulProducts;
