import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiUser, HiSave, HiStar, HiLightningBolt, HiShieldCheck } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentProfile() {
    const { user } = useSelector(s => s.auth);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [premium, setPremium] = useState(null);
    const [totalApplications, setTotalApplications] = useState(0);
    const [form, setForm] = useState({
        icaiRegistration: '', college: '', graduationYear: '', currentStatus: 'looking',
        skills: '', preferredLocations: '', bio: ''
    });

    useEffect(() => {
        api.get('/students/me').then(r => {
            const d = r.data.data;
            setForm({
                icaiRegistration: d.icaiRegistration || '', college: d.college || '',
                graduationYear: d.graduationYear || '', currentStatus: d.currentStatus || 'looking',
                skills: d.skills?.join(', ') || '', preferredLocations: d.preferredLocations?.join(', ') || '',
                bio: d.profile?.bio || ''
            });
            setPremium(d.premium || null);
            setTotalApplications(d.totalApplications || 0);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/students/me', {
                ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                preferredLocations: form.preferredLocations.split(',').map(s => s.trim()).filter(Boolean),
                profile: { bio: form.bio }
            });
            toast.success('Profile updated!');
        } catch (err) { toast.error('Failed to update'); }
        setSaving(false);
    };

    const isPremiumActive = premium?.active && premium?.expiryDate && new Date(premium.expiryDate) > new Date();

    if (loading) return <div className="page-container text-center py-20"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    return (
        <div className="page-container animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="section-title">My <span className="text-primary-600">Profile</span></h1><p className="section-subtitle">Manage your professional information</p></div>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2"><HiSave className="w-5 h-5" />{saving ? 'Saving...' : 'Save'}</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Avatar + Subscription */}
                <div className="space-y-6">
                    <div className="card text-center">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiUser className="w-10 h-10 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <p className="text-primary-600 text-sm font-medium mt-2 capitalize">{form.currentStatus}</p>
                    </div>

                    {/* Subscription Card */}
                    <div className={`card border-2 ${isPremiumActive ? (premium?.plan === 'pro' ? 'border-amber-400 bg-amber-50/30' : 'border-primary-400 bg-primary-50/30') : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            {isPremiumActive ? (
                                premium?.plan === 'pro' ? <HiLightningBolt className="w-6 h-6 text-amber-600" /> : <HiStar className="w-6 h-6 text-primary-600" />
                            ) : (
                                <HiShieldCheck className="w-6 h-6 text-gray-400" />
                            )}
                            <h3 className="font-bold text-gray-900">
                                {isPremiumActive ? `${premium?.plan === 'pro' ? 'Pro' : 'Premium'} Plan` : 'Free Plan'}
                            </h3>
                        </div>

                        {isPremiumActive ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-semibold text-green-600">Active ✓</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Plan</span>
                                    <span className="font-semibold text-gray-900 capitalize">{premium?.plan}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Started</span>
                                    <span className="text-gray-700">{new Date(premium?.startDate).toLocaleDateString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Expires</span>
                                    <span className="text-gray-700">{new Date(premium?.expiryDate).toLocaleDateString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Applications</span>
                                    <span className="font-semibold text-gray-900">Unlimited</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Applications Used</span>
                                    <span className="font-semibold text-gray-900">{totalApplications} / 5</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((totalApplications / 5) * 100, 100)}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {totalApplications >= 5 ? 'You have used all free applications.' : `${5 - totalApplications} free applications remaining.`}
                                </p>
                                <Link to="/student/premium" className="btn-primary w-full text-center block mt-3 text-sm">
                                    Upgrade to Premium
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label-text">ICAI Registration</label><input className="input-field" placeholder="WRO0XXXXXX" value={form.icaiRegistration} onChange={e => setForm({ ...form, icaiRegistration: e.target.value })} /></div>
                            <div><label className="label-text">College</label><input className="input-field" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} /></div>
                            <div><label className="label-text">Graduation Year</label><input type="number" className="input-field" value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} /></div>
                            <div><label className="label-text">Current Status</label>
                                <select className="input-field" value={form.currentStatus} onChange={e => setForm({ ...form, currentStatus: e.target.value })}>
                                    <option value="looking">Looking for Articleship</option><option value="placed">Placed</option><option value="not_looking">Not Looking</option>
                                </select></div>
                        </div>
                    </div>

                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900">Skills & Preferences</h3>
                        <div><label className="label-text">Skills (comma-separated)</label><input className="input-field" placeholder="Taxation, Audit, GST..." value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} /></div>
                        <div><label className="label-text">Preferred Locations (comma-separated)</label><input className="input-field" placeholder="Mumbai, Delhi, Bangalore..." value={form.preferredLocations} onChange={e => setForm({ ...form, preferredLocations: e.target.value })} /></div>
                        <div><label className="label-text">Bio</label><textarea className="input-field" rows="4" placeholder="Tell firms about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
