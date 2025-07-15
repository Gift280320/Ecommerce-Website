
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  mpesaTransactionId?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}
