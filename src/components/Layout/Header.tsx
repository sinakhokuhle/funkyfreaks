import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

export default function Header({ onCartClick, onAuthClick }: HeaderProps) {
  const { state } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/1000239715.jpg" 
                alt="Funky Freaks Logo" 
                className="h-10 w-10 rounded-full object-cover animate-pulse hover:animate-bounce transition-all duration-300"
              />
              <div>
                <h1 className="text-xl font-bold text-white">Funky Freaks</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Quality over Quantity</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#products" className="text-gray-300 hover:text-white transition-colors">Products</a>
            <a href="#categories" className="text-gray-300 hover:text-white transition-colors">Categories</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            <button
              onClick={onAuthClick}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <User className="w-6 h-6" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <a href="#home" className="text-gray-300 hover:text-white transition-colors py-2">Home</a>
              <a href="#products" className="text-gray-300 hover:text-white transition-colors py-2">Products</a>
              <a href="#categories" className="text-gray-300 hover:text-white transition-colors py-2">Categories</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors py-2">About</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}