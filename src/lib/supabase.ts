import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin authentication
export const adminAuth = {
  async login(password: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/admin-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ password }),
    })
    
    return response.json()
  }
}

// Product management (admin only)
export const productAPI = {
  async getAll(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/manage-products`, {
      method: 'GET',
      headers,
    })
    
    return response.json()
  },

  async create(productData: any, token: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/manage-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })
    
    return response.json()
  },

  async update(id: string, productData: any, token: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/manage-products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })
    
    return response.json()
  },

  async delete(id: string, token: string) {
    const response = await fetch(`${supabaseUrl}/functions/v1/manage-products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    return response.json()
  }
}

// Order management
export const orderAPI = {
  async create(orderData: any) {
    const response = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(orderData),
    })
    
    return response.json()
  }
}