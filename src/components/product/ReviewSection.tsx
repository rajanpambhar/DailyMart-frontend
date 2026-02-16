
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Loader2, Send, Trash2 } from 'lucide-react';
import { reviewsApi } from '../../services';
import type { Review } from '../../services/reviewsApi';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

interface ReviewSectionProps {
    productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuthStore();

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            rating: 5,
            comment: '',
        }
    });

    const ratingValue = watch('rating');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewsApi.getReviews(productId);
                setReviews(data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const onSubmit = async (data: { rating: number; comment: string }) => {
        if (!isAuthenticated) {
            toast.error('Please login to write a review');
            return;
        }

        setSubmitting(true);
        try {
            const newReview = await reviewsApi.createReview(productId, data.rating, data.comment);

            // Ensure user details are present for display (handling potential backend lag)
            const reviewWithUser = {
                ...newReview,
                user: newReview.user || { fullname: user?.fullname || 'Anonymous' }
            };

            setReviews([reviewWithUser, ...reviews]);
            reset();
            toast.success('Review submitted successfully!');
        } catch (error: any) {
            const status = error.response?.status;
            if (status === 404) {
                toast.error('Feature not available: Please restart backend server');
            } else {
                toast.error(error.response?.data?.message || 'Failed to submit review');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (reviewId: string) => {
        setDeleteReviewId(reviewId);
    };

    const confirmDelete = async () => {
        if (!deleteReviewId) return;

        try {
            await reviewsApi.deleteReview(deleteReviewId);
            setReviews(reviews.filter(r => r.id !== deleteReviewId));
            toast.success('Review deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        } finally {
            setDeleteReviewId(null);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    if (loading) return <div className="py-8 text-center text-gray-400">Loading reviews...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-dark-600 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Customer Reviews</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 text-white font-bold">{averageRating}</span>
                        </div>
                        <span className="text-gray-400 text-sm">Based on {reviews.length} reviews</span>
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Write a Review</h3>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-gray-300 text-sm">Select Rating:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setValue('rating', star)}
                                    className={`p-1 transition-transform hover:scale-110 ${star <= ratingValue ? 'text-yellow-400' : 'text-gray-600'}`}
                                >
                                    <Star className={`w-6 h-6 ${star <= ratingValue ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <textarea
                            {...register('comment', { required: 'Please write a comment', minLength: { value: 10, message: 'Minimum 10 characters' } })}
                            placeholder="Share your thoughts about this product..."
                            className="input-field min-h-[100px] resize-none"
                        />
                        {errors.comment && <p className="form-error">{errors.comment.message as string}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        Submit Review
                    </button>
                </form>
            ) : (
                <div className="bg-dark-700/50 rounded-xl p-6 text-center border border-dark-600 border-dashed">
                    <p className="text-gray-400 mb-4">Please log in to write a review.</p>
                    <a href="/login" className="btn-secondary text-sm">Login Now</a>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-dark-600 pb-6 last:border-0 animate-slide-up">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold">
                                        {review.user?.fullname?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{review.user?.fullname || 'Anonymous'}</p>
                                        <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                    {isAuthenticated && user?.id === review.userId && (
                                        <button
                                            onClick={() => handleDeleteClick(review.id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                            title="Delete Review"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed pl-[52px]">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <ConfirmationModal
                isOpen={!!deleteReviewId}
                onClose={() => setDeleteReviewId(null)}
                onConfirm={confirmDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
            />
        </div>
    );
};

export default ReviewSection;
