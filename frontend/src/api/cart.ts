export interface CartItem {
  product: any;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];

  addItem(product: any, quantity: number): void {
    const existingItem = this.items.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getItems(): CartItem[] {
    return this.items;
  }
}

// Dummy Cart API for frontend only
export const getCart = async () => {
  return { items: [{ id: 1, name: 'Product 1', price: 100, qty: 2 }] };
};
export const updateCart = async (item: any) => {
  return { success: true };
};
export const removeCartItem = async (id: number) => {
  return { success: true };
};

export {};
