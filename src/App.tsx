import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { productService } from './services/productService';
import { orderService } from './services/orderService';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Hero from './components/Home/Hero';
import FeaturedProducts from './components/Home/FeaturedProducts';
import Categories from './components/Home/Categories';
import ProductDetails from './components/Products/ProductDetails';
import Cart from './components/Cart/Cart';
import AuthModal from './components/Auth/AuthModal';
import Checkout from './components/Checkout/Checkout';
import { Product } from './types';

function AppContent() {
  const { state, dispatch } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    // Load products from Supabase
    loadProducts();
  }, [dispatch]);

  const loadProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await productService.getAllProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    if (!product.sizes.length || !product.colors.length) {
      alert('Please select size and color from product details');
      return;
    }

    const cartItem = {
      product,
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: product.colors[0],
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    alert(`Added ${product.name} to cart!`);
  };

  const handleCategoryClick = (category: string) => {
    // Scroll to products section or filter products
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    if (!state.user) {
      setIsAuthOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSubmit = async (orderData: any) => {
    try {
      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        // Clear cart after successful order
        dispatch({ type: 'CLEAR_CART' });
        
        // Reload products to update inventory
        await loadProducts();
        
        return result;
      } else {
        throw new Error(result.error || 'Order failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      throw error;
    }
  };
  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
      />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="categories">
          <Categories onCategoryClick={handleCategoryClick} />
        </section>
        
        <section id="products">
          <FeaturedProducts 
            products={state.products}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        </section>
      </main>

      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSubmit={handleOrderSubmit}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;