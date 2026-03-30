const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, unread } = req.query;
        const query = { userId: req.user._id };
        if (unread === 'true') query.isRead = false;

        const notifications = await Notification.find(query).sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(parseInt(limit));
        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

        res.json({ success: true, data: { notifications, total, unreadCount, page: parseInt(page) } });
    } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, { isRead: true }, { new: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json({ success: true, data: notification });
    } catch (error) { next(error); }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) { next(error); }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) { next(error); }
};
