import React, { useEffect, useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const [logoAnimated, setLogoAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Animated Logo */}
        <div className={`mb-12 transform transition-all duration-1000 ${logoAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="relative inline-block">
            <img 
              src="/1000239715.jpg" 
              alt="Funky Freaks Logo" 
              className="h-48 w-48 md:h-64 md:w-64 mx-auto rounded-2xl object-cover shadow-2xl ring-8 ring-purple-500 ring-opacity-50 animate-pulse hover:animate-spin transition-all duration-500"
            />
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
          </div>
        </div>

        {/* Brand Name with Animation */}
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 animate-fadeInUp">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Funky
          </span>
          <span className="ml-4 text-white">Freaks</span>
        </h1>

        {/* Slogan */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-12 animate-fadeInUp animation-delay-500 max-w-3xl mx-auto font-medium">
          "Clothes are just like friends - you want <span className="text-purple-400 font-semibold">quality</span>, not <span className="text-pink-400 font-semibold">quantity</span>"
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-1000">
          <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
            <span>Shop Collection</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-500 hover:text-white transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>New Arrivals</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}