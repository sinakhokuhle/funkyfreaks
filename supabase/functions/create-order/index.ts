import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OrderItem {
  product: {
    id: string
    name: string
    price: number
  }
  quantity: number
  selectedSize: string
  selectedColor: string
}

interface OrderData {
  customerName: string
  customerEmail?: string
  phoneNumber: string
  homeAddress?: string
  items: OrderItem[]
  subtotal: number
  deliveryCost: number
  totalPrice: number
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress?: string
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

    const orderData: OrderData = await req.json()

    // Generate order number
    const orderNumber = `FF${Date.now().toString().slice(-6)}`

    // Insert order into database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        phone_number: orderData.phoneNumber,
        home_address: orderData.homeAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_cost: orderData.deliveryCost,
        total_price: orderData.totalPrice,
        delivery_method: orderData.deliveryMethod,
        delivery_address: orderData.deliveryAddress,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update product stock
    for (const item of orderData.items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.product.id,
        quantity: item.quantity
      })
    }

    // Send WhatsApp notification
    await sendWhatsAppNotification(order, orderData)

    return new Response(
      JSON.stringify({ success: true, order, orderNumber }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
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

async function sendWhatsAppNotification(order: any, orderData: OrderData) {
  try {
    // WhatsApp Cloud API integration
    const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
    const recipientNumber = '27658553612' // Store owner's number

    if (!whatsappToken || !phoneNumberId) {
      console.log('WhatsApp credentials not configured')
      return
    }

    const orderItems = orderData.items.map(item => 
      `• ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity} - R${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n')

    const message = `🛍️ *New Order - Funky Freaks*

*Order Number:* ${order.order_number}
*Customer:* ${orderData.customerName}
*Email:* ${orderData.customerEmail || 'Not provided'}
*Phone:* ${orderData.phoneNumber}

*Order Details:*
${orderItems}

*Delivery Method:* ${orderData.deliveryMethod === 'pickup' ? 'Self Pickup' : 'Home Delivery'}
${orderData.deliveryAddress ? `*Delivery Address:* ${orderData.deliveryAddress}` : ''}

*Subtotal:* R${orderData.subtotal.toFixed(2)}
*Delivery Cost:* R${orderData.deliveryCost.toFixed(2)}
*Total:* R${orderData.totalPrice.toFixed(2)}

*Status:* Pending Payment

Please confirm this order and provide payment details.`

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    if (!response.ok) {
      console.error('WhatsApp API error:', await response.text())
    }
  } catch (error) {
    console.error('WhatsApp notification error:', error)
  }
}