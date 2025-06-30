import { corsHeaders } from "../_shared/cors.ts";

interface EmailRequest {
  recipient_email: string;
  subject: string;
  html_content: string;
  sender_name?: string;
  sender_email?: string;
}

// Use the built-in Deno.serve instead of importing serve from deno.land
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    // Hardcode the Resend API key for testing purposes
    // In production, you should use environment variables
    const RESEND_API_KEY = "re_PemtK3j4_MDHAY82ATafZhCDnidSS6FAN"; // Replace with your actual Resend API key

    if (!RESEND_API_KEY) {
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

    // Replace template variables with sample values for the test email
    const processedContent = html_content
      .replace(/\{\{first_name\}\}/g, "John")
      .replace(/\{\{last_name\}\}/g, "Doe")
      .replace(/\{\{email\}\}/g, recipient_email)
      .replace(/\{\{[^}]+\}\}/g, "[Variable]"); // Replace any other template variables

    console.log("Sending test email to:", recipient_email);
    
    // Send the email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender_name ? `${sender_name} <${sender_email || "noreply@lumicea.com"}>` : "Lumicea <noreply@lumicea.com>",
        to: recipient_email,
        subject: `[TEST] ${subject}`,
        html: processedContent,
        text: processedContent.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(responseData)}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Test email sent to ${recipient_email}`,
        data: responseData,
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