const RatingComponent = ({ courseId, currentRating, onRatingUpdate }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;
        setIsSubmitting(true);
        const result = await addRating(courseId, rating, review);
        if (result) {
            onRatingUpdate(result);
            setRating(0);
            setReview('');
        }
        setIsSubmitting(false);
    };
    return (
        <form onSubmit={handleSubmit} className="rating-form">
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review (optional)"
                rows="3"
            />
            <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="submit-rating-btn"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
        </form>
    );
};
export default RatingComponent;