import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Truck, CreditCard, Star, Loader2 } from 'lucide-react';
import { cancelOrder, submitReview, getOrderById } from '../api/orders';
import ReviewForm from '../components/ReviewForm';
import { OrderDetails } from '../interfaces/Order';

const OrderSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
    {/* Order Header */}
    <div className="flex justify-between items-center">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="h-8 w-32 bg-gray-200 rounded"></div>
    </div>

    {/* Order Status */}
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Order Items */}
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-24 w-24 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Order Summary */}
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      if (!id) {
        return;
      }
      const response: any = await getOrderById(id);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        toast.error('Failed to load order details');
      }
    } catch {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }
    try {
      setIsCancelling(true);
      await cancelOrder(order._id);
      toast.success('Order cancelled successfully');
      loadOrderDetails();
    } catch {
      toast.error('Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    if (!order) {
      return;
    }
    try {
      setIsSubmittingReview(true);
      await submitReview(order._id, review);
      toast.success('Thank you for your review!');
      setIsReviewModalOpen(false);
      loadOrderDetails();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOrderItems = () =>
    order?.items?.map((item) => (
      <div key={item._id} className="py-4 flex justify-between items-center">
        <div>
          <div className="font-medium">{item.product?.name || 'Unnamed Product'}</div>
          <div className="text-gray-600">Quantity: {item.quantity}</div>
          <div className="text-gray-600">Price: ₹{item.price}</div>
        </div>
        <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
      </div>
    ));

  if (loading) {
    return <OrderSkeleton />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg text-center text-red-600">
          Order not found
        </div>
      </div>
    );
  }

  const isDelivered = order.deliveryStatus === 'delivered';
  const canReview = isDelivered && !order.reviewed;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Order Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
        <span className="text-xl font-semibold">Order #{order?._id}</span>
      </div>

      {/* Order Status and Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Truck className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-semibold">Delivery Status</span>
            </div>
            <span className={`px-3 py-1 rounded ${getStatusColor(order.deliveryStatus)}`}>
              {order.deliveryStatus
                ? order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1)
                : 'Not Available'}
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
                  : 'bg-yellow-100 text-yellow-800'
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
        {order?.status !== 'cancelled' && (
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isCancelling ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </div>
            ) : (
              'Cancel Order'
            )}
          </button>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="divide-y">{renderOrderItems()}</div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between items-center border-t pt-4">
          <span className="font-semibold">Total Amount</span>
          <span className="text-xl font-bold">₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Feedback Section */}
      {isDelivered && (
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
        {order.status === 'pending' && (
          <button
            onClick={handleCancelOrder}
            className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            disabled={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
        {canReview && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={isSubmittingReview}
          >
            {isSubmittingReview ? 'Submitting...' : 'Write Review'}
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

export default OrderDetailsPage;
