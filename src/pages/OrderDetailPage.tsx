// =====================================================
// ORDER DETAIL PAGE
// =====================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Loader2, MapPin, Phone, User, CreditCard } from 'lucide-react';
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

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await ordersApi.getOrder(parseInt(id));
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
        <Link to="/orders" className="btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/orders" className="btn-ghost">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Order #{order.id}</h1>
          <p className="text-gray-400">
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Order Items</h2>
            
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-dark-600/50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-dark-600 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {item.product?.name || 'Product'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      ₹{Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-white">
                    ₹{Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-dark-500 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-primary-500">
                  ₹{Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {/* Status */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment</span>
                <span className={`badge ${statusColors[order.paymentStatus]}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Delivery</span>
                <span className={`badge ${statusColors[order.deliveryStatus]}`}>
                  {order.deliveryStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" />
              Payment Method
            </h2>
            <p className="text-white">{order.paymentMethod.replace('_', ' ')}</p>
          </div>

          {/* Shipping Info */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Shipping Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-primary-500 mt-0.5" />
                <span className="text-gray-300">{order.shippingName}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-500 mt-0.5" />
                <span className="text-gray-300">{order.shippingPhone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5" />
                <span className="text-gray-300">{order.shippingAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
