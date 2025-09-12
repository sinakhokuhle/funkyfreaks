import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { password } = await req.json()
    
    // Check if password matches store owner password
    const isValidAdmin = password === 'mbhele@funkyfreaks'
    
    if (isValidAdmin) {
      // Generate a simple JWT-like token (in production, use proper JWT)
      const token = btoa(JSON.stringify({
        isAdmin: true,
        email: 'ss.mbhele10@gmail.com',
        timestamp: Date.now()
      }))
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          token,
          user: {
            email: 'ss.mbhele10@gmail.com',
            isAdmin: true
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})