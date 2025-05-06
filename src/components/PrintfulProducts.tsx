
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

  // Let's also modify the edge function to provide more debugging information
  // Now updating the client file to add more detailed logging:
  <lov-write file_path="src/integrations/printful/client.ts">
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = 'https://qmasltemgjtbwrwscxtj.supabase.co/functions/v1/printful';

/**
 * Printful API client - uses Supabase Edge Function to make secure API calls
 */
export const printful = {
  /**
   * Get store information
   */
  getStore: async () => {
    return await fetchPrintful('stores');
  },

  /**
   * Get all products from Printful
   */
  getProducts: async () => {
    console.log('Calling Printful API for products...');
    try {
      const data = await fetchPrintful('sync/products');
      console.log('Printful API products response received');
      return data;
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },

  /**
   * Get a specific product by ID
   */
  getProduct: async (productId: string) => {
    return await fetchPrintful(`sync/products/${productId}`);
  },

  /**
   * Get product variants
   */
  getVariants: async (productId: string) => {
    return await fetchPrintful(`sync/products/${productId}/variants`);
  },

  /**
   * Create a Printful order
   */
  createOrder: async (orderData: any) => {
    return await fetchPrintful('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Estimate shipping costs for an order
   */
  estimateShipping: async (shipmentData: any) => {
    return await fetchPrintful('shipping/rates', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });
  },
};

/**
 * Helper function to make fetch requests to Printful via the Supabase Edge Function
 */
async function fetchPrintful(endpoint: string, options: RequestInit = {}) {
  try {
    console.log(`Fetching Printful endpoint: ${endpoint}`);
    
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    // Set up headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization if user is logged in
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build the URL
    const url = `${BASE_URL}/${endpoint}`;
    console.log(`Making request to: ${url}`);

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      console.error(`HTTP error from Printful Edge function: ${response.status}`);
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response from Printful:', data);
      throw new Error(data.error || 'An error occurred when connecting to Printful');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from Printful:', error);
    throw error;
  }
}
