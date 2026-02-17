import { useState, useEffect, useRef } from 'react';
import { Tag, X, Loader2, ChevronDown, Percent, IndianRupee } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { couponsApi } from '../../services';
import type { Coupon } from '../../services/couponsApi';
import toast from 'react-hot-toast';

const CouponInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    const [isFetchingCoupons, setIsFetchingCoupons] = useState(false);
    const { coupon, applyCoupon, removeCoupon } = useCartStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch available coupons
    useEffect(() => {
        const fetchCoupons = async () => {
            setIsFetchingCoupons(true);
            try {
                const coupons = await couponsApi.getAll();
                // Filter only active and non-expired coupons
                const validCoupons = coupons.filter(c =>
                    c.isActive && new Date(c.expiry) > new Date()
                );
                setAvailableCoupons(validCoupons);
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
            } finally {
                setIsFetchingCoupons(false);
            }
        };

        fetchCoupons();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleApplyCoupon = async (selectedCoupon: Coupon) => {
        setIsLoading(true);
        try {
            const result = await couponsApi.applyCoupon(selectedCoupon.code);
            applyCoupon(result);
            setIsOpen(false);
            toast.success(`Coupon ${selectedCoupon.code} applied successfully!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to apply coupon');
        } finally {
            setIsLoading(false);
        }
    };

    if (coupon) {
        return (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary-400">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium text-sm">
                        Coupon <b>{coupon.code}</b> applied!
                        <span className="block text-xs opacity-80 mt-0.5">
                            {coupon.type === 'PERCENTAGE' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                        </span>
                    </span>
                </div>
                <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 hover:bg-primary-500/20 rounded-full text-primary-400 transition-colors"
                    title="Remove coupon"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isFetchingCoupons || isLoading}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2.5 text-sm text-left text-gray-400 hover:border-primary-500/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all flex items-center justify-between"
            >
                <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {isFetchingCoupons ? 'Loading coupons...' : 'Select a coupon code'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {availableCoupons.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No coupons available at the moment
                        </div>
                    ) : (
                        <div className="p-2 space-y-2">
                            {availableCoupons.map((availableCoupon) => (
                                <button
                                    key={availableCoupon.id}
                                    type="button"
                                    onClick={() => handleApplyCoupon(availableCoupon)}
                                    disabled={isLoading}
                                    className="w-full text-left p-3 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 transition-all group disabled:opacity-50"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-bold text-primary-400 text-sm">
                                                    {availableCoupon.code}
                                                </span>
                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded text-xs font-medium">
                                                    {availableCoupon.type === 'PERCENTAGE' ? (
                                                        <>
                                                            <Percent className="w-3 h-3" />
                                                            {availableCoupon.discount}% OFF
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IndianRupee className="w-3 h-3" />
                                                            ₹{availableCoupon.discount} OFF
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                Valid until {new Date(availableCoupon.expiry).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-xs text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            Apply →
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-dark-900/50 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                </div>
            )}
        </div>
    );
};

export default CouponInput;
