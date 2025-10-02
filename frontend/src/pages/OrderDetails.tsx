import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Truck, CreditCard, Star } from 'lucide-react';
import { getOrderDetails, cancelOrder, submitReview } from '../api/orders';
import ReviewForm from '../components/ReviewForm';

interface OrderItem {
  id: number;
  name: string;
  qty: number;
}

interface OrderDetails {
  id: number;
  status: string;
  amount: number;
  items: OrderItem[];
  paymentStatus: string;
  deliveryStatus: string;
  canCancel: boolean;
  reviewed: boolean;
  createdAt: string;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      if (!id) {
        return;
      }
      const data = await getOrderDetails(Number(id));
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await cancelOrder(order.id);
      toast.success('Order cancelled successfully');
      loadOrderDetails();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    try {
      if (!order) {
        return;
      }
      await submitReview(order.id, review);
      toast.success('Thank you for your review!');
      setIsReviewModalOpen(false);
      loadOrderDetails();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center text-red-600">Order not found</div>
      </div>
    );
  }

  const isDelivered = order.deliveryStatus === 'delivered';
  const canReview = isDelivered && !order.reviewed;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-600 hover:text-red-600 flex items-center"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span>Back to Orders</span>
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-red-700">Order #{order.id}</h2>

      {/* Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Truck className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-semibold">Delivery Status</span>
          </div>
          <span
            className={`px-3 py-1 rounded ${
              order.deliveryStatus === 'delivered'
                ? 'bg-green-100 text-green-800'
                : order.deliveryStatus === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CreditCard className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-semibold">Payment Status</span>
          </div>
          <span
            className={`px-3 py-1 rounded ${
              order.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-2 font-semibold">Order Date</div>
          <div>{new Date(order.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-600">Quantity: {item.qty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between items-center border-t pt-4">
          <span className="font-semibold">Total Amount</span>
          <span className="text-xl font-bold">₹{order.amount}</span>
        </div>
      </div>

      {/* Feedback Section for Delivered Orders */}
      {order.deliveryStatus === 'delivered' && (
        <div className="mb-8 bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Order Feedback</h3>

          {!order.reviewed ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-gray-800 font-medium mb-2">
                How was your experience with this order?
              </p>
              <p className="text-gray-600 mb-4">
                Your feedback helps other customers make better choices!
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Star className="w-5 h-5 mr-2" />
                Give Your Feedback
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 bg-green-50 rounded-lg text-green-700">
              <Star className="w-5 h-5 fill-current mr-2" />
              Thank you for your feedback!
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {order.canCancel && (
          <button
            onClick={handleCancelOrder}
            className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Cancel Order
          </button>
        )}

        {canReview && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewForm onSubmit={handleSubmitReview} onClose={() => setIsReviewModalOpen(false)} />
      )}
    </div>
  );
};

export default OrderDetails;
