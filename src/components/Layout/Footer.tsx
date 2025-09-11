import React from 'react';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/1000239715.jpg" 
                alt="Funky Freaks Logo" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-white">Funky Freaks</h3>
            </div>
            <p className="text-gray-400 text-sm">
              "Clothes are just like friends - you want quality, not quantity"
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-2">
              <a href="#home" className="block text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#products" className="block text-gray-400 hover:text-white transition-colors">Products</a>
              <a href="#categories" className="block text-gray-400 hover:text-white transition-colors">Categories</a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Customer Service</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Size Guide</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Returns</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Shipping Info</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@funkyfreaks.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+27 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Cape Town, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Funky Freaks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}