// Dummy Checkout API for frontend only
export const getAddresses = async () => {
  return { addresses: [{ id: 1, line: '123 Main St', city: 'NY', zip: '10001' }] };
};
export const addAddress = async (address: any) => {
  return { success: true };
};
export const deleteAddress = async (id: number) => {
  return { success: true };
};
export const placeOrder = async (order: any) => {
  return { success: true, orderId: 123 };
};
export {};
