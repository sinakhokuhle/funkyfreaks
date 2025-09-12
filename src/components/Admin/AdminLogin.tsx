import React, { useState } from 'react'
import { X, Lock, User } from 'lucide-react'
import { adminAuth } from '../../lib/supabase'
import { useApp } from '../../contexts/AppContext'

interface AdminLoginProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminLogin({ isOpen, onClose }: AdminLoginProps) {
  const { dispatch } = useApp()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await adminAuth.login(password)
      
      if (result.success) {
        // Store admin token and user info
        localStorage.setItem('adminToken', result.token)
        dispatch({ 
          type: 'SET_USER', 
          payload: {
            id: 'admin',
            firstName: 'Store',
            lastName: 'Owner',
            email: 'ss.mbhele10@gmail.com',
            homeAddress: 'Durban, South Africa',
            isAdmin: true
          }
        })
        onClose()
        alert('Admin login successful!')
      } else {
        setError('Invalid password')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value="Store Owner"
              disabled
              className="w-full bg-gray-800 text-gray-400 pl-10 pr-4 py-3 rounded-lg border border-gray-700"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Admin access only for store management
          </p>
        </div>
      </div>
    </div>
  )
}