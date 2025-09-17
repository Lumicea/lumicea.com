// send-test-email/index.ts

// The Resend Deno SDK is a better, more secure way to interact with the API
import { Resend } from 'https://deno.land/x/resend@1.0.0/mod.ts';
import { corsHeaders } from "../_shared/cors.ts";

interface EmailRequest {
  recipient_email: string;
  subject: string;
  html_content: string;
  sender_name?: string;
  sender_email?: string;
}

// Access the Resend API key from Supabase Secrets using Deno.env.get()
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check if the Resend API key is available
    if (!resend.apikey) {
      return new Response(
        JSON.stringify({
          error: "Resend API key not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the request body
    const { recipient_email, subject, html_content, sender_name, sender_email } = await req.json() as EmailRequest;

    // Validate required fields
    if (!recipient_email || !subject || !html_content) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: recipient_email, subject, and html_content are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use the Resend SDK's built-in email sending method
    const { data, error } = await resend.emails.send({
      from: sender_name ? `${sender_name} <${sender_email || "noreply@lumicea.com"}>` : "Lumicea <noreply@lumicea.com>",
      to: recipient_email,
      subject: `[TEST] ${subject}`,
      html: html_content,
      // The Resend SDK will automatically handle a text version if not provided
    });
   
    if (error) {
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({
          error: `Resend API error: ${error.message}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Test email sent to ${recipient_email}`,
        data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending test email:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to send test email: ${error.message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
