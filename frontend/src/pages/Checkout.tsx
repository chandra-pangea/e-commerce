import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCart } from '../api/cart';

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const { items, total } = await getCart();
      setTotalAmount((total + 49).toFixed(2) as unknown as number);
    } catch (error) {
      toast.error('Failed to load cart details');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // clearCart();
      toast.success('Order placed successfully!');
      navigate('/order/confirmation');
    }, 2000);
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we process your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

      <div className="mb-6">
        <div className="text-lg font-semibold text-gray-800">Order Total: ₹{totalAmount}</div>
        <div className="text-sm text-gray-600">(Including ₹49 shipping)</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Card Holder Name</label>
          <input
            type="text"
            name="name"
            value={paymentDetails.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 border rounded"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              className="w-full p-2 border rounded"
              maxLength={5}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className="w-full p-2 border rounded"
              maxLength={3}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>This is a dummy payment page. Don&apos;t enter real card details.</p>
      </div>
    </div>
  );
};

export default Checkout;
