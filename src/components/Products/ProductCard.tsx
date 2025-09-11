import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
          onClick={() => onProductClick(product)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2 bg-purple-600/80 backdrop-blur-sm rounded-full text-white hover:bg-purple-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="absolute top-4 left-4">
          {product.inventory > 0 ? (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              In Stock
            </span>
          ) : (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-400 text-sm font-medium uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        <h3
          className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-white">
            R{product.price}
          </span>
          <span className="text-gray-400 text-sm">
            {product.inventory} left
          </span>
        </div>

        {/* Size Options Preview */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-gray-400 text-sm">Sizes:</span>
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
          )}
        </div>

        {/* Color Options Preview */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-gray-400 text-sm">Colors:</span>
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-600"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              ></div>
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onProductClick(product)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}