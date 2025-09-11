import React, { useState } from 'react';
import { X, MapPin, Truck, Package, CreditCard } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import DeliveryMap from './DeliveryMap';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { state, dispatch } = useApp();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Calculate delivery cost based on distance (mock calculation)
  const calculateDeliveryCost = () => {
    if (deliveryMethod === 'pickup') return 0;
    if (!deliveryLocation) return 50; // Default delivery cost
    
    // Mock distance-based calculation
    const baseDistance = 10; // km
    const costPerKm = 5;
    return Math.max(50, baseDistance * costPerKm);
  };

  const deliveryCost = calculateDeliveryCost();
  const total = subtotal + deliveryCost;

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setDeliveryLocation(location);
    setShowMap(false);
  };

  const handlePlaceOrder = () => {
    if (!state.user) {
      alert('Please login to place an order');
      return;
    }

    if (deliveryMethod === 'delivery' && !deliveryLocation) {
      alert('Please select a delivery location');
      return;
    }

    // Generate order number
    const orderNumber = `FF${Date.now().toString().slice(-6)}`;

    const order = {
      id: Date.now().toString(),
      orderNumber,
      userId: state.user.id,
      items: [...state.cart],
      subtotal,
      deliveryCost,
      total,
      deliveryMethod,
      deliveryAddress: deliveryLocation?.address,
      status: 'pending' as const,
      createdAt: new Date(),
    };

    // Add order and clear cart
    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });

    // Mock email automation
    console.log('Sending confirmation email...', {
      to: state.user.email,
      orderNumber,
      total,
    });

    // Redirect to WhatsApp with order details
    redirectToWhatsApp(order, state.user);
    
    alert(`Order placed successfully! Order number: ${orderNumber}`);
    onClose();
  };

  const redirectToWhatsApp = (order: any, user: any) => {
    const phoneNumber = '27658553612'; // Remove leading 0 and add country code
    
    // Create order details message
    const orderItems = order.items.map((item: any) => 
      `• ${item.product.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity} - R${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `🛍️ *New Order - Funky Freaks*

*Order Number:* ${order.orderNumber}
*Customer:* ${user.firstName} ${user.lastName}
*Email:* ${user.email}
*Phone:* ${user.phone || 'Not provided'}

*Order Details:*
${orderItems}

*Delivery Method:* ${order.deliveryMethod === 'pickup' ? 'Self Pickup' : 'Home Delivery'}
${order.deliveryAddress ? `*Delivery Address:* ${order.deliveryAddress}` : ''}

*Subtotal:* R${order.subtotal.toFixed(2)}
*Delivery Cost:* R${order.deliveryCost.toFixed(2)}
*Total:* R${order.total.toFixed(2)}

*Status:* Pending Payment

Please confirm this order and provide payment details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3">
              {state.cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-white font-medium">{item.product.name}</p>
                      <p className="text-gray-400 text-sm">
                        {item.selectedSize} | {item.selectedColor} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-white font-semibold">
                    R{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Delivery Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  deliveryMethod === 'pickup'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Self Pickup</p>
                    <p className="text-gray-400 text-sm">Free - Collect from store</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  deliveryMethod === 'delivery'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-white font-semibold">Home Delivery</p>
                    <p className="text-gray-400 text-sm">R{deliveryCost} - Delivered to you</p>
                  </div>
                </div>
              </button>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="mt-4">
                <button
                  onClick={() => setShowMap(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Select Delivery Location</span>
                </button>
                
                {deliveryLocation && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                    <p className="text-white text-sm">
                      <strong>Delivery Address:</strong> {deliveryLocation.address}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Estimated cost: R{deliveryCost}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">Capitec Pay</p>
                  <p className="text-gray-400 text-sm">Secure payment via Capitec Bank</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-semibold">WhatsApp Order</p>
                  <p className="text-gray-400 text-sm">Complete order via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery:</span>
                <span>{deliveryCost === 0 ? 'Free' : `R${deliveryCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-xl border-t border-gray-700 pt-2">
                <span>Total:</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Map Modal */}
      {showMap && (
        <DeliveryMap
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}