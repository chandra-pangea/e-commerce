// Dummy Admin API for frontend only
export const getAllUsers = async () => {
  return { users: [{ id: 1, email: 'user@example.com', name: 'User', blocked: false }] };
};

export const blockUser = async (id: number) => {
  return { success: true };
};

export const getAllOrders = async () => {
  return {
    orders: [
      {
        id: 123,
        status: 'pending',
        amount: 200,
        items: [{ id: 1, name: 'Product 1', qty: 2 }],
        paymentStatus: 'paid',
        deliveryStatus: 'pending',
        createdAt: '2025-10-02',
      },
      {
        id: 124,
        status: 'delivered',
        amount: 150,
        items: [{ id: 2, name: 'Product 2', qty: 1 }],
        paymentStatus: 'paid',
        deliveryStatus: 'delivered',
        createdAt: '2025-10-01',
      },
    ],
  };
};

export const updateOrderStatus = async (id: number, status: string) => {
  return { success: true };
};

export const getAllProducts = async () => {
  return { products: [{ id: 1, name: 'Product 1', price: 100 }] };
};

export const createProduct = async (product: any) => {
  return { success: true };
};

export const updateProduct = async (id: number, product: any) => {
  return { success: true };
};

export const deleteProduct = async (id: number) => {
  return { success: true };
};

export {};
