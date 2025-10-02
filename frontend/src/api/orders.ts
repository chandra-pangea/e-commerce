// Dummy Orders API for frontend only
export const getOrders = async () => {
  return {
    orders: [
      {
        id: 123,
        status: 'pending',
        amount: 200,
        items: [{ id: 1, name: 'Product 1', qty: 2 }],
        createdAt: '2025-10-02',
        canCancel: true,
        reviewed: false,
      },
      {
        id: 124,
        status: 'delivered',
        amount: 150,
        items: [{ id: 2, name: 'Product 2', qty: 1 }],
        createdAt: '2025-10-01',
        canCancel: false,
        reviewed: false,
      },
    ],
  };
};

export const getOrderDetails = async (id: number) => {
  return {
    id,
    status: 'shipped',
    amount: 200,
    items: [{ id: 1, name: 'Product 1', qty: 2 }],
    paymentStatus: 'paid',
    deliveryStatus: 'shipped',
    canCancel: true,
    reviewed: false,
    createdAt: '2025-10-02',
  };
};

export const cancelOrder = async (orderId: number) => {
  return { success: true };
};

export const submitReview = async (
  orderId: number,
  review: { rating: number; comment: string },
) => {
  return { success: true };
};

export {};
