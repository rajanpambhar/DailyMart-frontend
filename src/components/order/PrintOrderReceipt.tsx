// =====================================================
// PRINT ORDER RECEIPT COMPONENT
// Custom print layout for order details
// =====================================================

import { Order } from '../../types';
import { Package, MapPin, Phone, User, Calendar, Hash, CreditCard } from 'lucide-react';

interface PrintOrderReceiptProps {
    order: Order;
}

const PrintOrderReceipt = ({ order }: PrintOrderReceiptProps) => {
    const subtotal = order.totalAmount;
    const discount = order.discountAmount || 0;
    const tax = 0;
    const shipping = 0;

    return (
        <div className="print-receipt">
            {/* Print Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">DailyMart</h1>
                <p className="text-gray-600">Your Modern Supermarket</p>
                <p className="text-sm text-gray-500 mt-2">
                    123 Market Street, New York, NY 10001 | +1 (234) 567-890
                </p>
            </div>

            {/* Order Info Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Receipt</h2>
                        <p className="text-gray-600 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Order #{order.id}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 flex items-center justify-end gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {new Date(order.orderDate).toLocaleTimeString('en-US')}
                        </p>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                        <p className="font-semibold text-gray-900">{order.paymentStatus}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Delivery Status</p>
                        <p className="font-semibold text-gray-900">{order.deliveryStatus}</p>
                    </div>
                </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-300">
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p className="text-gray-700">
                            <span className="font-medium">Name:</span> {order.shippingName}
                        </p>
                        <p className="text-gray-700 flex items-start gap-2">
                            <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {order.shippingPhone}
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Delivery Address
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {order.shippingAddress}
                    </p>
                </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items ({order.orderItems.length})
                </h3>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-y border-gray-300">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">#</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900">Qty</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">Price</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                                <td className="py-3 px-4">
                                    <p className="font-medium text-gray-900">{item.product?.name || 'Product'}</p>
                                </td>
                                <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                                <td className="py-3 px-4 text-right text-gray-700">₹{Number(item.price).toFixed(2)}</td>
                                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                    ₹{Number(item.subtotal).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Summary */}
            <div className="ml-auto max-w-sm">
                <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span>₹{Number(subtotal).toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span className="flex items-center gap-2">
                                Discount
                                {order.couponCode && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-300">
                                        {order.couponCode}
                                    </span>
                                )}
                            </span>
                            <span className="font-medium">-₹{Number(discount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                        <span>Shipping:</span>
                        <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Tax:</span>
                        <span>₹{Number(tax).toFixed(2)}</span>
                    </div>
                </div>
                <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-gray-900">
                            ₹{Number(order.finalAmount).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 pt-6 border-t border-gray-300">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
                <p className="mb-2">Thank you for shopping with DailyMart!</p>
                <p>For any queries, contact us at support@dailymart.com or call +1 (234) 567-890</p>
                <p className="mt-4 text-xs text-gray-500">
                    © {new Date().getFullYear()} DailyMart. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default PrintOrderReceipt;
