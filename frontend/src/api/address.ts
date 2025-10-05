import { get, post, put } from './Http';

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export const getAddresses = async (): Promise<{
  addresses: Address[];
  defaultAddress: Address | null;
}> => {
  const res: any = await get('/auth/addresses');
  return res.data;
};

export const addAddress = async (address: Address): Promise<{ data: Address }> => {
  return await post('/auth/address', address);
};

export const updateAddress = async (
  addressId: string,
  address: Address,
): Promise<{ data: Address }> => {
  return await put(`/auth/address/${addressId}`, address);
};

export const setDefaultAddress = async (addressId: string): Promise<{ data: Address }> => {
  return await put(`/auth/address/${addressId}/default`, {});
};
