
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    size?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

const StarRating = ({ rating, size = 16, interactive = false, onRate }: StarRatingProps) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const handleRate = (index: number) => {
        if (interactive && onRate) {
            onRate(index + 1);
        }
    };

    for (let i = 0; i < 5; i++) {
        let starIcon;
        let className = `w-${size / 4} h-${size / 4} transition-colors `;

        if (interactive) {
            className += "cursor-pointer hover:scale-110 ";
        }

        if (i < fullStars) {
            // Full star
            className += "text-yellow-400 fill-yellow-400";
            starIcon = <Star width={size} height={size} className={className} />;
        } else if (i === fullStars && hasHalfStar && !interactive) {
            // Half star (only for display mode)
            className += "text-yellow-400 fill-yellow-400";
            starIcon = <StarHalf width={size} height={size} className={className} />;
        } else {
            // Empty star
            className += interactive && i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600";
            starIcon = <Star width={size} height={size} className={className} />;
        }

        stars.push(
            <div key={i} onClick={() => handleRate(i)} className={interactive ? "p-1" : ""}>
                {starIcon}
            </div>
        );
    }

    return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
