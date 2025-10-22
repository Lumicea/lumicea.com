// supabase/functions/generate-cloudinary-signature/index.ts

import { serve } from 'https-deno.land-std-http-server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Helper to convert string to ArrayBuffer
function strToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

// Helper to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

serve(async (req: Request) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get the API Secret from Supabase environment variables
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
    if (!apiSecret) {
      throw new Error('CLOUDINARY_API_SECRET is not set in Supabase secrets.')
    }

    // 2. Get the parameters to sign from the client request
    // We'll sign the timestamp and any other params you want to lock,
    // like upload folder or tags. For now, just timestamp is fine.
    const { paramsToSign } = await req.json()

    if (!paramsToSign || typeof paramsToSign.timestamp === 'undefined') {
      return new Response(JSON.stringify({ error: 'Missing timestamp in paramsToSign' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    // 3. Create the string to sign
    // Sort parameters alphabetically by key
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&')
    
    const stringToSign = `${sortedParams}${apiSecret}`

    // 4. Generate the SHA-1 signature (Deno uses Web Crypto API)
    const key = await crypto.subtle.importKey(
      'raw',
      strToArrayBuffer(apiSecret),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    // Re-create the string *without* the secret for SHA1 hashing
    // The signature for direct uploads is just the params + secret
    const dataToSign = strToArrayBuffer(stringToSign);
    
    const signatureBuffer = await crypto.subtle.digest(
      'SHA-1',
      dataToSign
    );

    const signature = bufferToHex(signatureBuffer)

    // 5. Return the signature and timestamp to the client
    return new Response(JSON.stringify({ signature }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
