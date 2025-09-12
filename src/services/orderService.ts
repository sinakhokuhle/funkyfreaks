import { orderAPI } from '../lib/supabase'
import { CartItem, User } from '../types'

export interface OrderData {
  customerName: string
  customerEmail?: string
  phoneNumber: string
  homeAddress?: string
  items: CartItem[]
  subtotal: number
  deliveryCost: number
  totalPrice: number
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress?: string
}

export const orderService = {
  async createOrder(orderData: OrderData) {
    try {
      const result = await orderAPI.create(orderData)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }
}