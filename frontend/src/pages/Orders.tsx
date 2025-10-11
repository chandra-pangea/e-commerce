import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Star, Package, Calendar } from 'lucide-react';
import { getOrders, submitReview, cancelOrder } from '../api/orders';
import ReviewForm from '../components/ReviewForm';
import type { OrderDetails, OrderItem } from '../interfaces/Order';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!orderId) {
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [`cancel_${orderId}`]: true }));
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      await loadOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`cancel_${orderId}`]: false }));
    }
  };

  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    if (!selectedOrderId) {
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [`review_${selectedOrderId}`]: true }));
      await submitReview(selectedOrderId, review);
      toast.success('Thank you for your review!');
      setSelectedOrderId(null);
      await loadOrders();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`review_${selectedOrderId}`]: false }));
    }
  };

  const renderOrderItems = (items: OrderItem[]) => {
    return items.map((item) => (
      <div key={item._id} className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          {item.product?.images?.[0] && (
            <img
              src={item.product.images[0]}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
          )}
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-600">
              ₹{item.price} × {item.quantity}
            </p>
          </div>
        </div>
        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>

          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="animate-pulse">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {[...Array(2)].map((_, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-32 bg-gray-200 rounded"></div>
                      <div className="flex gap-4">
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-red-700 text-center">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t placed any orders yet.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">{renderOrderItems(order.items)}</div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</span>

                    <div className="flex items-center gap-4">
                      <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                        View Details
                      </Link>

                      {order.status === 'delivered' && !order.reviewed && (
                        <button
                          onClick={() => setSelectedOrderId(order._id)}
                          disabled={actionLoading[`review_${order._id}`]}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading[`review_${order._id}`] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4" />
                              Give Feedback
                            </>
                          )}
                        </button>
                      )}

                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={actionLoading[`cancel_${order._id}`]}
                          className="flex items-center gap-2 text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading[`cancel_${order._id}`] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              Cancelling...
                            </>
                          ) : (
                            'Cancel Order'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrderId && (
          <ReviewForm onSubmit={handleSubmitReview} onClose={() => setSelectedOrderId(null)} />
        )}
      </div>
    </div>
  );
};

export default Orders;
