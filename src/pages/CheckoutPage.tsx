// =====================================================
// CHECKOUT PAGE
// Migrated from: PHP checkout.php
// =====================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CreditCard, Wallet, Building, Smartphone, Truck, CheckCircle } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { ordersApi, addressesApi } from '../services';
import type { Address } from '../services/addressesApi';
import { PaymentMethod } from '../types';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import CouponInput from '../components/cart/CouponInput';
import { useRazorpay } from '../hooks/useRazorpay';

const checkoutSchema = z.object({
  shippingName: z.string().min(1, 'Please enter your full name'),
  shippingPhone: z.string().min(10, 'Please enter a valid phone number'),
  shippingAddress: z.string().min(10, 'Please enter your complete address'),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  {
    value: 'RAZORPAY',
    label: 'Pay Online',
    icon: CreditCard,
    description: 'Credit/Debit Card, UPI, Net Banking'
  },
  {
    value: 'COD',
    label: 'Cash on Delivery',
    icon: Wallet,
    description: 'Pay when you receive'
  },
];

const CheckoutPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, totalPrice, clearCart, coupon, discountAmount, finalPrice } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const { isLoaded: isRazorpayLoaded, initiatePayment } = useRazorpay();

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const data = await addressesApi.getAddresses();
          setAddresses(data);

          // If there's a default address, select it and populate form
          const defaultAddr = data.find(a => a.isDefault);
          if (defaultAddr) {
            selectAddress(defaultAddr);
          } else if (data.length > 0) {
            // Or select the first one if no default
            selectAddress(data[0]);
          }
        } catch (error) {
          console.error('Failed to load addresses');
        } finally {
        }
      };
      fetchAddresses();
    }
  }, [user]);

  const selectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setValue('shippingName', addr.fullName);
    setValue('shippingPhone', addr.phone);
    setValue('shippingAddress', `${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}`);
  };

  const handleAddressSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAddressId(id);

    if (id === 'new') {
      setValue('shippingName', '');
      setValue('shippingPhone', '');
      setValue('shippingAddress', '');
    } else {
      const addr = addresses.find(a => a.id === id);
      if (addr) selectAddress(addr);
    }
  };

  const total = totalPrice();
  const discount = discountAmount();
  const final = finalPrice();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'COD',
    },
  });

  const selectedPayment = watch('paymentMethod');

  if (items.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    try {
      // Create order first
      const order = await ordersApi.createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: data.paymentMethod as PaymentMethod,
        shippingName: data.shippingName,
        shippingAddress: data.shippingAddress,
        shippingPhone: data.shippingPhone,
        couponCode: coupon?.code,
      });

      // If COD, complete the order immediately
      if (data.paymentMethod === 'COD') {
        setOrderId(order.id);
        clearCart();
        setOrderSuccess(true);
        toast.success('Order placed successfully!');
        setIsLoading(false);
        return;
      }

      // For online payments, initiate Razorpay
      initiatePayment(
        order.finalAmount,
        order.id,
        {
          name: data.shippingName,
          email: user?.email,
          phone: data.shippingPhone,
        },
        () => {
          // Payment successful
          setOrderId(order.id);
          clearCart();
          setOrderSuccess(true);
          setIsLoading(false);
        },
        () => {
          // Payment failed or cancelled
          setIsLoading(false);
          toast.error('Payment was not completed. Your order is saved as pending.');
        }
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(message);
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-16 animate-fade-in">
        <div className="max-w-md mx-auto text-center glass-card p-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-400 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-400 mb-6">
            Order ID: <span className="text-primary-500 font-medium">#{orderId}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Link to={`/orders/${orderId}`} className="btn-primary w-full justify-center">
              View Order Details
            </Link>
            <Link to="/" className="btn-secondary w-full justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-500" />
                Shipping Details
              </h2>

              {
                addresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Select from Address Book</label>
                    <select
                      value={selectedAddressId}
                      onChange={handleAddressSelection}
                      className="input-field w-full"
                    >
                      {addresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.type} - {addr.fullName}, {addr.city}
                        </option>
                      ))}
                      <option value="new">+ Add New Address</option>
                    </select>
                  </div>
                )
              }

              <div className="space-y-4">
                <div>
                  <label htmlFor="shippingName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="shippingName"
                    type="text"
                    placeholder="Enter your full name"
                    className={`input-field ${errors.shippingName ? 'border-red-500' : ''}`}
                    {...register('shippingName')}
                  />
                  {errors.shippingName && (
                    <p className="form-error">{errors.shippingName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingPhone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="shippingPhone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`input-field ${errors.shippingPhone ? 'border-red-500' : ''}`}
                    {...register('shippingPhone')}
                  />
                  {errors.shippingPhone && (
                    <p className="form-error">{errors.shippingPhone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingAddress" className="form-label">
                    Shipping Address
                  </label>
                  <textarea
                    id="shippingAddress"
                    rows={3}
                    placeholder="Enter your complete address"
                    className={`input-field resize-none ${errors.shippingAddress ? 'border-red-500' : ''}`}
                    {...register('shippingAddress')}
                  />
                  {errors.shippingAddress && (
                    <p className="form-error">{errors.shippingAddress.message}</p>
                  )}
                </div>
              </div>
            </div >

            {/* Payment Method */}
            < div className="glass-card p-6" >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setValue('paymentMethod', method.value as any)}
                    className={`p-6 rounded-lg border-2 transition-all ${selectedPayment === method.value
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-500 bg-dark-600 hover:border-dark-400'
                      }`}
                  >
                    <method.icon
                      className={`w-8 h-8 mb-3 mx-auto ${selectedPayment === method.value ? 'text-primary-500' : 'text-gray-400'
                        }`}
                    />
                    <p
                      className={`text-base font-semibold mb-1 ${selectedPayment === method.value ? 'text-white' : 'text-gray-400'
                        }`}
                    >
                      {method.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {method.description}
                    </p>
                  </button>
                ))}
              </div>
              {
                errors.paymentMethod && (
                  <p className="form-error mt-2">{errors.paymentMethod.message}</p>
                )
              }
            </div >
          </div >

          {/* Order Summary */}
          < div className="lg:col-span-1" >
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-white font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-500 pt-4 space-y-3 mb-6">
                <CouponInput />

                <div className="flex justify-between text-gray-400 pt-2">
                  <span>Subtotal</span>
                  <span className="text-white">₹{total.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-primary-400">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-dark-500">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-primary-500">
                    ₹{final.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Place Order
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="btn-ghost w-full mt-3 justify-center"
              >
                Back to Cart
              </Link>
            </div>
          </div >
        </div >
      </form >
    </div >
  );
};

export default CheckoutPage;
