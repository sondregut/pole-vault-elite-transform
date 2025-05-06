
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PRINTFUL_API_KEY = Deno.env.get('PRINTFUL_API_KEY');
    
    if (!PRINTFUL_API_KEY) {
      console.error('Printful API key not configured');
      throw new Error('Printful API key not configured');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const printfulEndpoint = path || 'stores';

    // Forward request to Printful API
    const printfulUrl = `https://api.printful.com/${printfulEndpoint}`;
    console.log(`Forwarding request to Printful: ${printfulUrl}`);
    console.log(`API Key configured: ${PRINTFUL_API_KEY ? 'Yes (length: ' + PRINTFUL_API_KEY.length + ')' : 'No'}`);

    // Parse the request body if it exists
    let requestBody = null;
    if (req.method !== 'GET' && req.headers.get('content-type')?.includes('application/json')) {
      requestBody = await req.json();
    }

    // Make request to Printful API
    const response = await fetch(printfulUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    const data = await response.json();
    
    console.log(`Response from Printful (status ${response.status})`);
    
    // Add more debugging for sync/products endpoint
    if (printfulEndpoint === 'sync/products') {
      if (data.result) {
        console.log(`Received ${data.result.length} products from Printful`);
        
        if (data.result.length === 0) {
          console.log('No products found in Printful store');
        } else {
          console.log('First product name:', data.result[0]?.name || 'Unnamed');
          console.log('Has sync_variants:', data.result[0]?.sync_variants ? 'Yes' : 'No');
        }
      } else {
        console.log('No result property in Printful response');
      }
      
      if (data.error) {
        console.error('Printful API error:', data.error);
      }
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error in Printful function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
