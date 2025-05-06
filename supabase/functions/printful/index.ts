
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
      throw new Error('Printful API key not configured');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const printfulEndpoint = path || 'stores';

    // Forward request to Printful API
    const printfulUrl = `https://api.printful.com/${printfulEndpoint}`;
    console.log(`Forwarding request to Printful: ${printfulUrl}`);

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
