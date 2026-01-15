// =====================================================
// ORDERS PAGE - User's Orders List
// =====================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Loader2, Eye, Calendar } from 'lucide-react';
import { ordersApi } from '../services';
import { Order } from '../types';

const statusColors: Record<string, string> = {
  PENDING: 'status-pending',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
  FAILED: 'status-cancelled',
  SHIPPED: 'status-shipped',
  DELIVERED: 'status-delivered',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-16 animate-fade-in">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">No Orders Yet</h1>
          <p className="text-gray-400 mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Order ID</p>
                <p className="font-bold text-white">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-white flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total</p>
                <p className="font-bold text-primary-500">₹{Number(order.totalAmount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Payment</p>
                <span className={`badge ${statusColors[order.paymentStatus]}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Delivery</p>
                <span className={`badge ${statusColors[order.deliveryStatus]}`}>
                  {order.deliveryStatus}
                </span>
              </div>
              <Link
                to={`/orders/${order.id}`}
                className="btn-secondary py-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </div>

            {/* Order Items Preview */}
            <div className="border-t border-dark-500 pt-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {order.orderItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-12 h-12 bg-dark-600 rounded-lg overflow-hidden"
                    title={item.product?.name}
                  >
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
                {order.orderItems.length > 5 && (
                  <span className="text-gray-400 text-sm">
                    +{order.orderItems.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
