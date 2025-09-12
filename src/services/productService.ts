import { supabase, productAPI } from '../lib/supabase'
import { Product } from '../types'

export const productService = {
  // Get all products (public)
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price),
      images: product.image_url ? [product.image_url] : [],
      category: product.category || 'general',
      sizes: product.sizes || [],
      colors: product.colors || [],
      inventory: product.stock || 0,
      featured: product.featured || false,
    }))
  },

  // Admin functions
  async createProduct(productData: any, token: string) {
    return await productAPI.create(productData, token)
  },

  async updateProduct(id: string, productData: any, token: string) {
    return await productAPI.update(id, productData, token)
  },

  async deleteProduct(id: string, token: string) {
    return await productAPI.delete(id, token)
  }
}