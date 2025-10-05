import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Star, Package, Calendar } from 'lucide-react';
import { getOrders, submitReview, cancelOrder } from '../api/orders';
import ReviewForm from '../components/ReviewForm';
import type { OrderDetails } from '../interfaces/Order';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.orders as OrderDetails[]);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      loadOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    if (!selectedOrderId) {
      return;
    }

    try {
      await submitReview(selectedOrderId, review);
      toast.success('Thank you for your review!');
      setSelectedOrderId(null);
      loadOrders();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderOrderItems = (items: OrderDetails['items']) => {
    return items.map((item) => (
      <div key={item.id} className="flex justify-between items-center text-sm">
        <span>
          {item.product.name} × {item.quantity}
        </span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-700">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
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
              </div>

              <div className="space-y-2">{renderOrderItems(order.items)}</div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total: ₹{order.amount}</span>

                  <div className="flex items-center gap-4">
                    <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>

                    {order.status === 'delivered' && (
                      <>
                        {!order.reviewed ? (
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            Give Feedback
                          </button>
                        ) : (
                          <span className="inline-flex items-center text-green-600">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            Reviewed
                          </span>
                        )}
                      </>
                    )}

                    {order.canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {order.status === 'delivered' && !order.reviewed && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    ✨ This order has been delivered! Please share your feedback to help other
                    customers.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedOrderId && (
        <ReviewForm onSubmit={handleSubmitReview} onClose={() => setSelectedOrderId(null)} />
      )}
    </div>
  );
};

export default Orders;
