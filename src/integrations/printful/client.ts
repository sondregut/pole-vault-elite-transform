
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
    console.log('Calling Printful API for store info...');
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
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
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
