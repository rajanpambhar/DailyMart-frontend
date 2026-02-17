// =====================================================
// ORDER DETAIL PAGE - ENHANCED VERSION
// =====================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Loader2,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Calendar,
  Hash
} from 'lucide-react';
import { ordersApi } from '../services';
import { Order } from '../types';
import PrintOrderReceipt from '../components/order/PrintOrderReceipt';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  SHIPPED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const statusIcons: Record<string, any> = {
  PENDING: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
  FAILED: XCircle,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await ordersApi.getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen container py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen container py-16 text-center">
        <div className="glass-card p-12 max-w-md mx-auto">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Order Not Found</h1>
          <p className="text-gray-400 mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/orders" className="btn-primary">
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const PaymentIcon = statusIcons[order.paymentStatus] || Clock;
  const DeliveryIcon = statusIcons[order.deliveryStatus] || Clock;

  // Calculate order summary
  const subtotal = order.totalAmount;
  const discount = order.discountAmount || 0;
  const tax = 0; // You can add tax calculation

  return (
    <div className="min-h-screen bg-dark-900 py-6">
      <div className="container animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                to="/orders"
                className="btn-ghost hover:bg-dark-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <Hash className="w-6 h-6 text-primary-500" />
                  Order {order.id}
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="btn-secondary hidden md:flex print:hidden"
            >
              <Printer className="w-5 h-5" />
              Print Order
            </button>
          </div>

          {/* Status Banner */}
          <div className="glass-card p-4 bg-gradient-to-r from-primary-500/10 to-secondary-400/10 border-primary-500/30">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <PaymentIcon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Payment Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusColors[order.paymentStatus]} text-sm font-semibold px-3 py-1`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-400/20 flex items-center justify-center flex-shrink-0">
                  <DeliveryIcon className="w-6 h-6 text-secondary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Delivery Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusColors[order.deliveryStatus]} text-sm font-semibold px-3 py-1`}>
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4 md:p-5 hover:border-primary-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary-500" />
                  Order Items
                </h2>
                <span className="badge badge-info">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 p-2 bg-dark-600/30 hover:bg-dark-600/60 rounded-lg transition-all duration-300 border border-transparent hover:border-primary-500/20"
                  >
                    <div className="relative w-12 h-12 bg-dark-700 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-dark-500 group-hover:ring-primary-500/50 transition-all">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary-500 text-dark-900 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-0.5 truncate group-hover:text-primary-400 transition-colors">
                        {item.product?.name || 'Product'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-medium">₹{Number(item.price).toFixed(2)}</span>
                        <span className="text-gray-600">×</span>
                        <span className="px-1.5 py-0.5 bg-dark-700 rounded text-[11px] font-medium">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-primary-400">
                        ₹{Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-dark-500 mt-6 pt-4 space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{Number(subtotal).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span className="flex items-center gap-2">
                      Discount
                      {order.couponCode && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                          {order.couponCode}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">-₹{Number(discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-400">FREE</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Tax</span>
                  <span className="font-semibold">₹{Number(tax).toFixed(2)}</span>
                </div>
                <div className="border-t border-dark-500 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-gradient">
                      ₹{Number(order.finalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-4">
            {/* Payment Info */}
            <div className="glass-card p-4 hover:border-primary-500/30 transition-colors">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                </div>
                Payment Method
              </h2>
              <div className="bg-dark-600/50 rounded-lg p-3 border border-dark-500">
                <p className="text-white font-semibold capitalize text-sm">
                  {order.paymentMethod.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="glass-card p-4 hover:border-primary-500/30 transition-colors">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary-400/20 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-secondary-400" />
                </div>
                Shipping Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-2.5 bg-dark-600/30 rounded-lg">
                  <User className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Customer Name</p>
                    <p className="text-white font-medium text-sm">{order.shippingName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-dark-600/30 rounded-lg">
                  <Phone className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-white font-medium">{order.shippingPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-dark-600/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-white font-medium leading-relaxed">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="glass-card p-4 bg-gradient-to-br from-primary-500/10 to-secondary-400/10 border-primary-500/30">
              <h3 className="text-base font-bold text-white mb-2">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Contact our support team for any questions about your order.
              </p>
              <Link to="/contact" className="btn-primary w-full justify-center">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only Receipt */}
      <PrintOrderReceipt order={order} />
    </div>
  );
};

export default OrderDetailPage;
