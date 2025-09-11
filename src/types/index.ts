export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inventory: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  homeAddress: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}