import { get, post, put } from './Http';

export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryStatus: 'pending' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  amount: number;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  canCancel: boolean;
  reviewed: boolean;
}

export const getOrders = async (): Promise<{ orders: Order[] }> => {
  return await get('/orders');
};

export const getOrderDetails = async (id: string): Promise<Order> => {
  return await get(`/orders/${id}`);
};

export const createOrder = async (
  addressId: string,
  paymentMethod: string,
): Promise<{ orderId: string }> => {
  return await post('/orders', { addressId, paymentMethod });
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  return await put(`/orders/${orderId}/cancel`);
};

export const submitReview = async (
  orderId: string,
  review: { rating: number; comment: string },
): Promise<void> => {
  return await post(`/orders/${orderId}/review`, review);
};
