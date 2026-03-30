import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOfficeBuilding, HiSave, HiCreditCard, HiShieldCheck, HiLightningBolt, HiChip } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PLAN_ICONS = { startup: HiOfficeBuilding, growth: HiLightningBolt, enterprise: HiChip };
const PLAN_LABELS = { startup: 'Startup', growth: 'Growth', enterprise: 'Enterprise' };

export default function FirmProfile() {
    const { user } = useSelector(s => s.auth);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [form, setForm] = useState({
        firmName: '', registrationNumber: '', website: '', description: '',
        address: { city: '', state: '', country: 'India' },
        teamSize: '', yearsInBusiness: '', specializations: '', contactEmail: '', contactPhone: ''
    });

    useEffect(() => {
        Promise.all([
            api.get('/firms/me').then(r => {
                const d = r.data.data;
                setForm({
                    firmName: d.firmName || '', registrationNumber: d.registrationNumber || '', website: d.website || '', description: d.description || '',
                    address: d.address || { city: '', state: '', country: 'India' }, teamSize: d.teamSize || '', yearsInBusiness: d.yearsInBusiness || '',
                    specializations: d.specializations?.join(', ') || '', contactEmail: d.contactEmail || '', contactPhone: d.contactPhone || ''
                });
                setSubscription(d.subscription || null);
            }),
            api.get('/subscriptions/me').then(r => {
                if (r.data.data) setSubscription(prev => ({ ...prev, ...r.data.data }));
            }).catch(() => {})
        ]).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/firms/me', { ...form, specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean) });
            toast.success('Profile updated!');
        } catch (err) { toast.error('Failed'); }
        setSaving(false);
    };

    const isSubActive = subscription?.status === 'active' && subscription?.expiryDate && new Date(subscription.expiryDate) > new Date();
    const PlanIcon = PLAN_ICONS[subscription?.plan] || HiShieldCheck;

    if (loading) return <div className="page-container text-center py-20"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    return (
        <div className="page-container animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="section-title">Firm <span className="text-primary-600">Profile</span></h1><p className="section-subtitle">Manage your firm's details</p></div>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2"><HiSave className="w-5 h-5" />{saving ? 'Saving...' : 'Save'}</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Info + Subscription */}
                <div className="space-y-6">
                    <div className="card text-center">
                        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><HiOfficeBuilding className="w-10 h-10 text-primary-600" /></div>
                        <h3 className="text-lg font-bold text-gray-900">{form.firmName || 'Your Firm'}</h3>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>

                    {/* Subscription Card */}
                    <div className={`card border-2 ${isSubActive ? 'border-primary-400 bg-primary-50/30' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <PlanIcon className={`w-6 h-6 ${isSubActive ? 'text-primary-600' : 'text-gray-400'}`} />
                            <h3 className="font-bold text-gray-900">
                                {isSubActive ? `${PLAN_LABELS[subscription?.plan] || subscription?.plan} Plan` : 'No Active Plan'}
                            </h3>
                        </div>

                        {isSubActive ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-semibold text-green-600">Active ✓</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Plan</span>
                                    <span className="font-semibold text-gray-900 capitalize">{PLAN_LABELS[subscription?.plan] || subscription?.plan}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Started</span>
                                    <span className="text-gray-700">{new Date(subscription?.startDate).toLocaleDateString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Expires</span>
                                    <span className="text-gray-700">{new Date(subscription?.expiryDate).toLocaleDateString('en-IN')}</span>
                                </div>
                                <Link to="/firm/billing" className="btn-secondary w-full text-center block mt-3 text-sm">
                                    Manage Subscription
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Subscribe to a plan to start posting jobs and accessing candidates.</p>
                                <Link to="/firm/billing" className="btn-primary w-full text-center block mt-3 text-sm flex items-center justify-center gap-2">
                                    <HiCreditCard className="w-4 h-4" /> Subscribe Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900">Basic Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label-text">Firm Name</label><input className="input-field" value={form.firmName} onChange={e => setForm({ ...form, firmName: e.target.value })} /></div>
                            <div><label className="label-text">Registration Number</label><input className="input-field" value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} /></div>
                            <div><label className="label-text">Website</label><input className="input-field" placeholder="https://" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                            <div><label className="label-text">Team Size</label><input type="number" className="input-field" value={form.teamSize} onChange={e => setForm({ ...form, teamSize: e.target.value })} /></div>
                            <div><label className="label-text">Years in Business</label><input type="number" className="input-field" value={form.yearsInBusiness} onChange={e => setForm({ ...form, yearsInBusiness: e.target.value })} /></div>
                            <div><label className="label-text">Specializations (comma-separated)</label><input className="input-field" placeholder="Taxation, Audit" value={form.specializations} onChange={e => setForm({ ...form, specializations: e.target.value })} /></div>
                        </div>
                        <div><label className="label-text">Description</label><textarea className="input-field" rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    </div>
                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900">Address & Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="label-text">City</label><input className="input-field" value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} /></div>
                            <div><label className="label-text">State</label><input className="input-field" value={form.address.state} onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })} /></div>
                            <div><label className="label-text">Country</label><input className="input-field" value={form.address.country} onChange={e => setForm({ ...form, address: { ...form.address, country: e.target.value } })} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label-text">Contact Email</label><input className="input-field" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} /></div>
                            <div><label className="label-text">Contact Phone</label><input className="input-field" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
