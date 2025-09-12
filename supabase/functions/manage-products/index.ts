import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const productId = url.pathname.split('/').pop()
    
    // Verify admin token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !isValidAdminToken(authHeader)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    switch (req.method) {
      case 'GET':
        // Get all products for admin
        const { data: products, error: getError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (getError) throw getError

        return new Response(
          JSON.stringify(products),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'POST':
        // Create new product
        const productData = await req.json()
        
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image_url: productData.image_url,
            stock: productData.stock || 0,
            sizes: productData.sizes || [],
            colors: productData.colors || [],
            category: productData.category,
            featured: productData.featured || false
          })
          .select()
          .single()

        if (createError) throw createError

        return new Response(
          JSON.stringify(newProduct),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          }
        )

      case 'PUT':
        // Update product
        const updateData = await req.json()
        
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(
          JSON.stringify(updatedProduct),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      case 'DELETE':
        // Delete product
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)

        if (deleteError) throw deleteError

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 405,
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

function isValidAdminToken(authHeader: string): boolean {
  try {
    const token = authHeader.replace('Bearer ', '')
    const decoded = JSON.parse(atob(token))
    return decoded.isAdmin === true && decoded.email === 'ss.mbhele10@gmail.com'
  } catch {
    return false
  }
}