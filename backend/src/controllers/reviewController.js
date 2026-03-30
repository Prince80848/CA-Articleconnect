const Review = require('../models/Review');

exports.createReview = async (req, res, next) => {
    try {
        const { targetId, targetType, rating, comment, tags } = req.body;
        const existing = await Review.findOne({ reviewerId: req.user._id, targetId });
        if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });

        const review = await Review.create({ reviewerId: req.user._id, targetId, targetType, rating, comment, tags });
        res.status(201).json({ success: true, data: review, message: 'Review submitted' });
    } catch (error) { next(error); }
};

exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ targetId: req.params.targetId })
            .populate('reviewerId', 'name avatar').sort({ createdAt: -1 });
        const avg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        res.json({ success: true, data: { reviews, averageRating: Math.round(avg * 10) / 10, totalReviews: reviews.length } });
    } catch (error) { next(error); }
};

exports.updateReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({ _id: req.params.id, reviewerId: req.user._id });
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        Object.assign(review, req.body);
        await review.save();
        res.json({ success: true, data: review, message: 'Review updated' });
    } catch (error) { next(error); }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.id, reviewerId: req.user._id });
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) { next(error); }
};
