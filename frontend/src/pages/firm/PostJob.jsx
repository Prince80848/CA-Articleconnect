import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJob } from '../../redux/slices/jobSlice';
import { HiBriefcase, HiPlus, HiTrash, HiInformationCircle, HiLockClosed, HiCreditCard } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function PostJob() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState(undefined); // undefined=loading, null=none, obj=active
    const [form, setForm] = useState({
        title: '', description: '', location: '', salaryMin: '', salaryMax: '', duration: 36,
        articleshipType: 'full-time', requirements: [''], skills: [''], interviewProcess: [''], benefits: ['']
    });

    useEffect(() => {
        api.get('/subscriptions/me')
            .then(r => setSubscription(r.data.data))
            .catch(() => setSubscription(null));
    }, []);

    const handleArrayField = (field, idx, val) => { const arr = [...form[field]]; arr[idx] = val; setForm({ ...form, [field]: arr }); };
    const addArrayItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
    const removeArrayItem = (field, idx) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== idx) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.location) return toast.error('Please fill required fields');
        setLoading(true);
        const payload = {
            ...form, salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax),
            requirements: form.requirements.filter(Boolean), skills: form.skills.filter(Boolean),
            interviewProcess: form.interviewProcess.filter(Boolean), benefits: form.benefits.filter(Boolean)
        };
        const result = await dispatch(createJob(payload));
        if (createJob.fulfilled.match(result)) { toast.success('Job posted!'); navigate('/firm/manage-jobs'); }
        else {
            const msg = result.payload || 'Failed to post job';
            if (msg.includes('subscription') || msg.includes('plan')) {
                toast.error('You need an active subscription to post jobs!');
                navigate('/firm/billing');
            } else {
                toast.error(msg);
            }
        }
        setLoading(false);
    };

    const renderArrayInput = (label, field, placeholder) => (
        <div key={field}>
            <label className="label-text">{label}</label>
            {form[field].map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input className="input-field flex-1" placeholder={placeholder} value={item} onChange={e => handleArrayField(field, i, e.target.value)} />
                    {form[field].length > 1 && <button type="button" onClick={() => removeArrayItem(field, i)} className="p-2.5 text-red-400 hover:text-red-600"><HiTrash className="w-4 h-4" /></button>}
                </div>
            ))}
            <button type="button" onClick={() => addArrayItem(field)} className="text-primary-600 text-sm flex items-center gap-1 hover:text-primary-700 font-medium"><HiPlus className="w-4 h-4" /> Add</button>
        </div>
    );

    // Loading state for subscription check
    if (subscription === undefined) return (
        <div className="page-container flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="page-container animate-fade-in max-w-3xl mx-auto">
            <h1 className="section-title mb-8">Post New <span className="text-primary-600">Job</span></h1>

            {/* Firm not verified */}
            {profile && profile.isVerified === false ? (
                <div className="card text-center py-16 px-4">
                    <HiInformationCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Your firm registration is currently under review by our admin team. You will be able to post and manage jobs once your account is verified. This usually takes 24-48 hours.
                    </p>
                    <Link to="/firm/dashboard" className="btn-primary">Return to Dashboard</Link>
                </div>

            /* No active subscription */
            ) : !subscription ? (
                <div className="card text-center py-16 px-6">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <HiLockClosed className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Required</h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-2">
                        To post jobs and connect with CA students, you need an active subscription plan.
                    </p>
                    <p className="text-gray-500 text-sm mb-8">Plans start from <span className="font-semibold text-gray-700">₹5,000/month</span> with a 30-day free cancellation.</p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/firm/billing" className="btn-primary flex items-center gap-2">
                            <HiCreditCard className="w-4 h-4" />
                            View Plans & Subscribe
                        </Link>
                        <Link to="/firm/dashboard" className="btn-secondary">Back to Dashboard</Link>
                    </div>
                </div>

            /* Form - Firm verified + subscription active */
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><HiBriefcase className="text-primary-600 w-5 h-5" /> Basic Info</h3>
                        <div><label className="label-text">Job Title *</label><input className="input-field" required placeholder="Senior Audit Associate" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                        <div><label className="label-text">Description *</label><textarea className="input-field" rows="5" required placeholder="Detailed job description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label-text">Location *</label><input className="input-field" required placeholder="Mumbai" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                            <div><label className="label-text">Type</label>
                                <select className="input-field" value={form.articleshipType} onChange={e => setForm({ ...form, articleshipType: e.target.value })}>
                                    <option value="full-time">Full-time</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option>
                                </select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="label-text">Min Salary (₹/month)</label><input type="number" className="input-field" placeholder="15000" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} /></div>
                            <div><label className="label-text">Max Salary (₹/month)</label><input type="number" className="input-field" placeholder="25000" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} /></div>
                            <div><label className="label-text">Duration (months)</label><input type="number" className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
                        </div>
                    </div>
                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900">Details</h3>
                        {renderArrayInput("Requirements", "requirements", "e.g., CA Inter passed")}
                        {renderArrayInput("Skills Needed", "skills", "e.g., Taxation")}
                        {renderArrayInput("Interview Process", "interviewProcess", "e.g., Round 1: Technical")}
                        {renderArrayInput("Benefits", "benefits", "e.g., Flexible hours")}
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">{loading ? 'Posting...' : 'Post Job'}</button>
                </form>
            )}
        </div>
    );
}
