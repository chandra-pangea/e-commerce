import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCart, addToCart, updateCartItem, removeFromCart, CartItem } from '../api/cart';
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
  const [havingDefaultAddress, setHavingDefaultAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
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
      setCartItems(data.items || []);
      setTotalAmount(data.total || 0);
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.addresses || []);
      const defaultAddr = res.defaultAddress || null;
      setHavingDefaultAddress(true);
      setSelectedAddress(defaultAddr);
      if (defaultAddr) {
        setAddressForm({
          street: defaultAddr.street,
          city: defaultAddr.city,
          state: defaultAddr.state,
          zipCode: defaultAddr.zipCode,
          country: defaultAddr.country || 'India',
        });
      }
    } catch (err) {
      toast.error('Failed to load addresses');
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number, stock: number) => {
    if (newQuantity < 1 || newQuantity > stock) {
      return;
    }

    try {
      const data = await updateCartItem(productId, newQuantity);
      setCartItems(data.items);
      setTotalAmount(data.total);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const data = await removeFromCart(productId);
      setCartItems(data.items);
      setTotalAmount(data.total);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAddress?._id) {
        await updateAddress(selectedAddress._id, addressForm);
        toast.success('Address updated');
      } else {
        await addAddress({ ...addressForm, isDefault: addresses.length === 0 });
        toast.success('Address added');
      }
      setShowAddressForm(false);
      loadAddresses();
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setAddressForm({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country || 'India',
    });
  };

  const handleSetDefaultAddress = async (addr: Address) => {
    try {
      if (!addr._id) {
        return;
      }
      await setDefaultAddress(addr._id);
      loadAddresses();
      toast.success('Default address updated');
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      return toast.error('Please select a shipping address');
    }

    try {
      const res = await createOrder(selectedAddress._id!);

      if (res.success && res.data.paymentLink) {
        const orderId = res.data.orderId;

        window.open(res.data.paymentLink, '_blank');

        // Poll every 10 seconds
        let elapsed = 0;
        const interval = setInterval(async () => {
          try {
            const orderStatus = await getOrderDetails(orderId);

            if (orderStatus && orderStatus.paymentStatus.toLowerCase() === 'paid') {
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
            toast.error('Payment status not updated. Please check your orders later.');
          }
        }, 5000);
      } else {
        toast.error('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong during checkout');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (cartItems.length === 0) {
    return <div className="p-6">Your cart is empty</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md divide-y">
          {cartItems.map((item) => (
            <div key={item._id} className="p-4 flex items-center">
              <img
                src={item.product.images?.[0] || '/logo192.png'}
                alt={item.product.name}
                className="w-24 h-24 object-contain rounded"
              />
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-red-600 font-bold">₹{item.product.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity - 1, item.product.stock)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="mx-3 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity + 1, item.product.stock)
                    }
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="ml-4 text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
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
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state}
                </p>
                <p>{selectedAddress.zipCode}</p>
              </div>
            )}

            <div className="mt-2 flex flex-col gap-2">
              {addresses.map((addr) => (
                <div key={addr._id} className="flex items-center justify-between">
                  <button
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-2 border rounded ${
                      selectedAddress?._id === addr._id ? 'bg-gray-200' : ''
                    }`}
                  >
                    {addr.street}, {addr.city}
                  </button>
                  {!havingDefaultAddress && (
                    <button
                      onClick={() => handleSetDefaultAddress(addr)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Set Default
                    </button>
                  )}
                  {addr.isDefault && <span className="text-sm text-green-600">Default</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹49</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{(totalAmount + 49).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!selectedAddress}
            className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
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
                  value={addressForm.street}
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
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={addressForm.state}
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
                  value={addressForm.zipCode}
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
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
