export interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export interface OrderItem {
  _id: string;
  product: ProductDetails;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryStatus: string;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: OrderDetails;
  error?: string;
}

export interface ReviewData {
  rating: number;
  comment: string;
}
