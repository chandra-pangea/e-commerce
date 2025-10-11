import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCart, updateCartItem, removeFromCart, CartItem } from '../api/cart';
import { getAddresses, addAddress, updateAddress, setDefaultAddress } from '../api/address';
import { createOrder, getOrderDetails } from '../api/orders';

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [havingDefaultAddress, setHavingDefaultAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressForm, setAddressForm] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load cart & addresses
  useEffect(() => {
    loadCart();
    loadAddresses();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid cart data');
      }
      setCartItems(Array.isArray(data?.items) ? data.items : []);
      setTotalAmount(Number(data?.total) || 0);
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      if (!res) {
        return;
      }

      const addrList = Array.isArray(res?.addresses) ? res.addresses : [];
      const defaultAddr = res?.defaultAddress || null;

      setAddresses(addrList);
      setHavingDefaultAddress(!!defaultAddr);
      setSelectedAddress(defaultAddr);

      if (defaultAddr) {
        setAddressForm({
          street: defaultAddr?.street || '',
          city: defaultAddr?.city || '',
          state: defaultAddr?.state || '',
          zipCode: defaultAddr?.zipCode || '',
          country: defaultAddr?.country || 'India',
        });
      }
    } catch (err) {
      toast.error('Failed to load addresses');
    }
  };

  const handleQuantityChange = async (productId?: string, newQuantity?: number, stock?: number) => {
    if (!productId || !newQuantity || !stock) {
      return;
    }
    if (newQuantity < 1 || newQuantity > stock) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [`qty_${productId}`]: true }));
      const data = await updateCartItem(productId, newQuantity);
      if (!data) {
        return;
      }
      setCartItems(Array.isArray(data?.items) ? data.items : []);
      setTotalAmount(Number(data?.total) || 0);
    } catch (err) {
      toast.error('Failed to update quantity');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`qty_${productId}`]: false }));
    }
  };

  const handleRemoveItem = async (productId?: string) => {
    if (!productId) {
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [`remove_${productId}`]: true }));
      const data = await removeFromCart(productId);
      if (!data) {
        return;
      }
      setCartItems(Array.isArray(data?.items) ? data.items : []);
      setTotalAmount(Number(data?.total) || 0);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`remove_${productId}`]: false }));
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading((prev) => ({ ...prev, saveAddress: true }));
      if (selectedAddress?._id) {
        await updateAddress(selectedAddress._id, addressForm);
        toast.success('Address updated');
      } else {
        await addAddress({ ...addressForm, isDefault: addresses.length === 0 });
        toast.success('Address added');
      }
      setShowAddressForm(false);
      await loadAddresses();
    } catch (err) {
      toast.error('Failed to save address');
    } finally {
      setActionLoading((prev) => ({ ...prev, saveAddress: false }));
    }
  };

  const handleSelectAddress = (addr?: Address) => {
    if (!addr) {
      return;
    }
    setSelectedAddress(addr);
    setAddressForm({
      street: addr?.street || '',
      city: addr?.city || '',
      state: addr?.state || '',
      zipCode: addr?.zipCode || '',
      country: addr?.country || 'India',
    });
  };

  const handleSetDefaultAddress = async (addr?: Address) => {
    if (!addr?._id) {
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [`default_${addr._id}`]: true }));
      await setDefaultAddress(addr._id);
      await loadAddresses();
      toast.success('Default address updated');
    } catch (err) {
      toast.error('Failed to set default address');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`default_${addr._id}`]: false }));
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress?._id) {
      return toast.error('Please select a shipping address');
    }

    try {
      setCheckoutLoading(true);
      const res = await createOrder(selectedAddress._id);
      if (!res?.success || !res?.data?.paymentLink) {
        throw new Error('Failed to create order');
      }

      const orderId = res?.data?.orderId;
      const paymentLink = res?.data?.paymentLink;

      if (!orderId || !paymentLink) {
        throw new Error('Missing order info');
      }

      window.open(paymentLink, '_blank');

      let elapsed = 0;
      const interval = setInterval(async () => {
        try {
          const orderStatus = await getOrderDetails(orderId);
          if (orderStatus?.paymentStatus?.toLowerCase() === 'paid') {
            clearInterval(interval);
            toast.success('Payment successful! Redirecting to orders...');
            navigate('/orders');
          }
        } catch (err) {
          console.error('Error checking order status:', err);
        }

        elapsed += 5000;
        if (elapsed >= 5 * 60 * 1000) {
          clearInterval(interval);
          setCheckoutLoading(false);
          toast.error('Payment status not updated. Please check your orders later.');
        }
      }, 5000);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong during checkout');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 p-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Loading Skeleton */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md divide-y">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 flex items-center">
                <div className="w-24 h-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="ml-4 flex-grow">
                  <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="flex items-center mt-2">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Order Summary Loading Skeleton */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4 mb-6">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse mt-4"></div>
              </div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-6"></div>
          </div>
        </div>
      </div>
    );
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-8 p-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md divide-y">
          {cartItems.map((item) => {
            if (!item?.product) {
              return null;
            }
            return (
              <div key={item?._id || Math.random()} className="p-4 flex items-center">
                <img
                  src={item?.product?.images?.[0] || '/logo192.png'}
                  alt={item?.product?.name || 'Product'}
                  className="w-24 h-24 object-contain rounded"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{item?.product?.name || 'Unnamed'}</h3>
                  <p className="text-red-600 font-bold">₹{item?.product?.price || 0}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item?.product?._id,
                          item?.quantity - 1,
                          item?.product?.stock,
                        )
                      }
                      disabled={
                        !item?.product?._id ||
                        item?.quantity <= 1 ||
                        actionLoading[`qty_${item?.product?._id}`] ||
                        actionLoading[`remove_${item?.product?._id}`]
                      }
                      className="disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="mx-3 w-8 text-center">
                      {actionLoading[`qty_${item?.product?._id}`] ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        item?.quantity || 0
                      )}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item?.product?._id,
                          item?.quantity + 1,
                          item?.product?.stock,
                        )
                      }
                      disabled={
                        !item?.product?._id ||
                        item?.quantity >= (item?.product?.stock || 0) ||
                        actionLoading[`qty_${item?.product?._id}`] ||
                        actionLoading[`remove_${item?.product?._id}`]
                      }
                      className="disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item?.product?._id)}
                      className="ml-4 text-red-500 disabled:opacity-50"
                      disabled={
                        !item?.product?._id || actionLoading[`remove_${item?.product?._id}`]
                      }
                    >
                      {actionLoading[`remove_${item?.product?._id}`] ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right font-bold">
                  ₹{((item?.product?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {/* Address Section */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddressForm(true)}
              className="text-blue-600 hover:underline"
            >
              {selectedAddress ? 'Edit Address' : 'Add Address'}
            </button>

            {selectedAddress && (
              <div className="mt-2 text-sm text-gray-600">
                <p>{selectedAddress?.street}</p>
                <p>
                  {selectedAddress?.city}, {selectedAddress?.state}
                </p>
                <p>{selectedAddress?.zipCode}</p>
              </div>
            )}

            {Array.isArray(addresses) && addresses.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {addresses.map((addr) => (
                  <div
                    key={addr?._id || Math.random()}
                    className="flex items-center justify-between"
                  >
                    <button
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-2 border rounded ${selectedAddress?._id === addr?._id ? 'bg-gray-200' : ''}`}
                    >
                      {addr?.street}, {addr?.city}
                    </button>
                    {!havingDefaultAddress && addr?._id && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr)}
                        disabled={actionLoading[`default_${addr._id}`]}
                        className="text-sm text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {actionLoading[`default_${addr._id}`] ? (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Setting...
                          </>
                        ) : (
                          'Set Default'
                        )}
                      </button>
                    )}
                    {addr?.isDefault && <span className="text-sm text-green-600">Default</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{(totalAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹49</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{((totalAmount || 0) + 49).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!selectedAddress?._id || checkoutLoading}
            className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <form onSubmit={handleAddressSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  value={addressForm?.street || ''}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={addressForm?.city || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={addressForm?.state || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={addressForm?.zipCode || ''}
                  onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.saveAddress}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading.saveAddress ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Processing Overlay */}
      {checkoutLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Checkout</h3>
            <p className="text-gray-600">Please wait while we process your order...</p>
            <p className="text-red-500 text-xs">
              I am using cashfree sandbox environment so it will be loading
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
