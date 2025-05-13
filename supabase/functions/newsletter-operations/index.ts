
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterOperationRequest {
  operation: 'send_batch' | 'send_test' | 'get_stats';
  emailSubject?: string;
  emailContent?: string;
  testEmail?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a Supabase client with the Auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Check for Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Missing Resend API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const resend = new Resend(resendApiKey);

    // Parse request body
    const { operation, emailSubject, emailContent, testEmail }: NewsletterOperationRequest = await req.json();

    // Handle different operations
    switch (operation) {
      case 'get_stats': {
        // Get subscriber stats
        const { data: stats, error: statsError } = await supabaseClient.rpc('get_newsletter_sync_stats');
        
        if (statsError) {
          console.error('Error fetching newsletter stats:', statsError);
          return new Response(JSON.stringify({ error: statsError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ stats }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'send_test': {
        // Send a test email to a specific address
        if (!testEmail || !emailSubject || !emailContent) {
          return new Response(JSON.stringify({ error: 'Missing required fields for test email' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        try {
          const { data: emailResponse, error: emailError } = await resend.emails.send({
            from: 'Stavhopp <newsletter@stavhopp.no>',
            to: [testEmail],
            subject: emailSubject,
            html: emailContent,
          });
          
          if (emailError) {
            throw new Error(emailError.message);
          }
          
          return new Response(JSON.stringify({ success: true, message: 'Test email sent successfully' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (err) {
          console.error('Error sending test email:', err);
          return new Response(JSON.stringify({ error: `Failed to send test email: ${err.message}` }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
      
      case 'send_batch': {
        // This would handle sending emails to all subscribers
        // For safety and to avoid rate limits, this part would need more complex implementation
        // Such as batching, tracking, etc. - implementing a skeleton here
        
        if (!emailSubject || !emailContent) {
          return new Response(JSON.stringify({ error: 'Missing required fields for batch email' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Get a batch of subscribers (limited to 50 for safety)
        const { data: subscribers, error: fetchError } = await supabaseClient
          .from('newsletter_subscribers')
          .select('email')
          .eq('email_sent', false)  // Only target subscribers who haven't received an email
          .limit(50);
          
        if (fetchError) {
          console.error('Error fetching subscribers:', fetchError);
          return new Response(JSON.stringify({ error: fetchError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        if (!subscribers || subscribers.length === 0) {
          return new Response(JSON.stringify({ message: 'No subscribers found who need emails' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // This is a simplified example - in production, you would need more robust handling
        const results = {
          total: subscribers.length,
          success: 0,
          failed: 0,
          errors: [] as string[]
        };
        
        // In a real implementation, you would process emails in batches
        return new Response(JSON.stringify({ 
          message: `Batch email would be sent to ${subscribers.length} subscribers`, 
          note: "Full implementation requires more robust handling with batching, retrying, etc."
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid operation' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in newsletter-operations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
