// Dummy Orders API for frontend only
export const getOrders = async () => {
  return {
    orders: [
      { id: 123, status: 'pending', amount: 200, items: [{ id: 1, name: 'Product 1', qty: 2 }] },
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
  };
};
export {};
