export interface OrderDetails {
  id: string;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryStatus: 'pending' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  amount: number;
  createdAt: string;
  canCancel: boolean;
  reviewed: boolean;
}
