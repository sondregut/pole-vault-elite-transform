
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Parse request body
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Resend with API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Missing Resend API key in environment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const resend = new Resend(resendApiKey);

    // Create a Supabase client with the Auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Send the welcome email
    try {
      const { data: emailResponse, error: emailError } = await resend.emails.send({
        from: 'Stavhopp <newsletter@stavhopp.no>',
        to: [email],
        subject: 'Welcome to the Stavhopp Newsletter!',
        html: `
          <div style="font-family: sans-serif; margin: 0 auto; max-width: 600px; padding: 20px;">
            <h1 style="color: #333; font-size: 24px;">Welcome to the Stavhopp Newsletter!</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Thank you for subscribing to our newsletter. You'll now receive updates about:
            </p>
            <ul style="color: #555; font-size: 16px; line-height: 1.5;">
              <li>Pole vaulting tips and techniques</li>
              <li>Training program updates</li>
              <li>Exclusive content from Olympic pole vaulters</li>
              <li>Special offers on our products</li>
            </ul>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              We're excited to have you as part of our community!
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Best regards,<br />
              Sondre & Simen Guttormsen
            </p>
          </div>
        `
      });

      if (emailError) {
        throw new Error(emailError.message);
      }

      // Update the subscriber as processed
      const { error: updateError } = await supabaseClient
        .from('newsletter_subscribers')
        .update({ email_sent: true })
        .eq('email', email);

      if (updateError) {
        console.error("Failed to update subscriber status:", updateError);
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error("Error sending email:", err);
      return new Response(JSON.stringify({ 
        error: `Failed to send email: ${err.message}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("General error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
