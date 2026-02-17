// =====================================================
// ADMIN ORDERS PAGE
// Migrated from: PHP admin_orders.php
// =====================================================

import { useEffect, useState } from 'react';
import { Eye, Loader2, Search } from 'lucide-react';
import { ordersApi } from '../../services';
import { Order, PaymentStatus, DeliveryStatus } from '../../types';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  PENDING: 'status-pending',
  COMPLETED: 'status-completed',
  CANCELLED: 'status-cancelled',
  FAILED: 'status-cancelled',
  SHIPPED: 'status-shipped',
  DELIVERED: 'status-delivered',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getOrders({ page: currentPage, limit: 10 });
      setOrders(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleUpdatePaymentStatus = async (id: string, status: PaymentStatus) => {
    try {
      await ordersApi.updatePaymentStatus(id, status);
      toast.success('Payment status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const handleUpdateDeliveryStatus = async (id: string, status: DeliveryStatus) => {
    try {
      await ordersApi.updateDeliveryStatus(id, status);
      toast.success('Delivery status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update delivery status');
    }
  };

  return (
    <div className="h-full overflow-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Delivery</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-600/50">
                    <td className="px-6 py-4 font-medium text-white">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{order.user?.fullname}</p>
                        <p className="text-sm text-gray-400">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-primary-500 font-medium">
                      ₹{Number(order.finalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                        className="bg-dark-600 border border-dark-500 rounded-lg px-2 py-1 text-sm text-white"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.deliveryStatus}
                        onChange={(e) => handleUpdateDeliveryStatus(order.id, e.target.value as DeliveryStatus)}
                        className="bg-dark-600 border border-dark-500 rounded-lg px-2 py-1 text-sm text-white"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-dark-600">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page
                    ? 'bg-primary-500 text-dark-900'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Order #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-white">{selectedOrder.user?.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Shipping Name</p>
                  <p className="text-white">{selectedOrder.shippingName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{selectedOrder.shippingPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              <div className="border-t border-dark-500 pt-4">
                <p className="text-sm text-gray-400 mb-2">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-dark-600/50 rounded-lg">
                      <span className="text-white">{item.product?.name} × {item.quantity}</span>
                      <span className="text-primary-500">₹{Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dark-500 pt-4 space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span className="flex items-center gap-2">
                      Discount
                      {selectedOrder.couponCode && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                          {selectedOrder.couponCode}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">-₹{Number(selectedOrder.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-dark-500">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-primary-500">
                    ₹{Number(selectedOrder.finalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
