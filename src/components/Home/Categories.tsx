import React from 'react';
import { Shirt, Crown, Zap, Star } from 'lucide-react';

const categories = [
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Urban fashion that speaks your language',
    icon: Shirt,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-purple-600 to-blue-600'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury pieces for the discerning individual',
    icon: Crown,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-pink-600 to-purple-600'
  },
  {
    id: 'limited',
    name: 'Limited Edition',
    description: 'Exclusive drops for the bold and unique',
    icon: Zap,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-yellow-600 to-red-600'
  },
  {
    id: 'bestsellers',
    name: 'Best Sellers',
    description: 'Customer favorites that never go out of style',
    icon: Star,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-green-600 to-blue-600'
  }
];

interface CategoriesProps {
  onCategoryClick: (category: string) => void;
}

export default function Categories({ onCategoryClick }: CategoriesProps) {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop by <span className="text-purple-400">Category</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find your perfect style across our carefully curated collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onCategoryClick(category.id)}
              >
                <div className="aspect-w-1 aspect-h-1 h-80">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="w-6 h-6" />
                      <h3 className="text-xl font-bold">{category.name}</h3>
                    </div>
                    <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}