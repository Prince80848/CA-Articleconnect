const Firm = require('../models/Firm');
const User = require('../models/User');

exports.getMyFirm = async (req, res, next) => {
    try {
        const firm = await Firm.findOne({ userId: req.user._id }).populate('userId', 'name email phone avatar');
        if (!firm) return res.status(404).json({ success: false, message: 'Firm profile not found' });
        res.json({ success: true, data: firm });
    } catch (error) { next(error); }
};

exports.updateFirm = async (req, res, next) => {
    try {
        const updates = {};
        const fields = ['firmName', 'registrationNumber', 'logo', 'website', 'description', 'address', 'teamSize', 'yearsInBusiness', 'specializations', 'contactEmail', 'contactPhone'];
        fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
        const firm = await Firm.findOneAndUpdate({ userId: req.user._id }, updates, { new: true, runValidators: true });
        if (!firm) return res.status(404).json({ success: false, message: 'Firm profile not found' });
        res.json({ success: true, data: firm, message: 'Firm updated' });
    } catch (error) { next(error); }
};

exports.getAllFirms = async (req, res, next) => {
    try {
        const { city, verified, page = 1, limit = 10, search } = req.query;
        const query = {};
        if (city) query['address.city'] = new RegExp(city, 'i');
        if (verified) query.isVerified = verified === 'true';
        if (search) query.firmName = new RegExp(search, 'i');

        const firms = await Firm.find(query).populate('userId', 'name email avatar')
            .skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
        const total = await Firm.countDocuments(query);

        res.json({ success: true, data: { firms, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (error) { next(error); }
};

exports.getFirmById = async (req, res, next) => {
    try {
        const firm = await Firm.findById(req.params.id).populate('userId', 'name email avatar');
        if (!firm) return res.status(404).json({ success: false, message: 'Firm not found' });
        res.json({ success: true, data: firm });
    } catch (error) { next(error); }
};
