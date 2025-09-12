import React, { useState, useEffect } from 'react'
import { X, Plus, Edit, Trash2, Save, Ambulance as Cancel } from 'lucide-react'
import { productService } from '../../services/productService'
import { Product } from '../../types'

interface ProductManagerProps {
  isOpen: boolean
  onClose: () => void
}

interface ProductForm {
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  sizes: string[]
  colors: string[]
  category: string
  featured: boolean
}

export default function ProductManager({ isOpen, onClose }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    stock: 0,
    sizes: [],
    colors: [],
    category: 'streetwear',
    featured: false
  })

  const adminToken = localStorage.getItem('adminToken')

  useEffect(() => {
    if (isOpen) {
      loadProducts()
    }
  }, [isOpen])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const productsData = await productService.getAllProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminToken) return

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct, formData, adminToken)
      } else {
        await productService.createProduct(formData, adminToken)
      }
      
      await loadProducts()
      resetForm()
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
    } catch (error) {
      alert('Error saving product. Please try again.')
    }
  }

  const handleDelete = async (productId: string) => {
    if (!adminToken || !confirm('Are you sure you want to delete this product?')) return

    try {
      await productService.deleteProduct(productId, adminToken)
      await loadProducts()
      alert('Product deleted successfully!')
    } catch (error) {
      alert('Error deleting product. Please try again.')
    }
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.images[0] || '',
      stock: product.inventory,
      sizes: product.sizes,
      colors: product.colors,
      category: product.category,
      featured: product.featured || false
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setShowAddForm(false)
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      stock: 0,
      sizes: [],
      colors: [],
      category: 'streetwear',
      featured: false
    })
  }

  const handleArrayInput = (field: 'sizes' | 'colors', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData({ ...formData, [field]: array })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Product Manager</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {showAddForm && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
                
                <input
                  type="number"
                  placeholder="Price (R)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
                
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none md:col-span-2"
                  rows={3}
                />
                
                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
                
                <input
                  type="text"
                  placeholder="Sizes (comma separated: S, M, L, XL)"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => handleArrayInput('sizes', e.target.value)}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="Colors (comma separated: Black, White, Red)"
                  value={formData.colors.join(', ')}
                  onChange={(e) => handleArrayInput('colors', e.target.value)}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="streetwear">Streetwear</option>
                  <option value="premium">Premium</option>
                  <option value="limited">Limited Edition</option>
                  <option value="accessories">Accessories</option>
                </select>
                
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Featured Product</span>
                </label>
                
                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Update' : 'Create'}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Cancel className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-white text-lg">Loading products...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-purple-400 font-bold">R{product.price}</span>
                      <span className="text-gray-400 text-sm">Stock: {product.inventory}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No products found</div>
              <p className="text-gray-500 text-sm mt-2">Add your first product to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}