import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiBriefcase, HiPlus, HiTrash, HiExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminPostJob() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isExternal, setIsExternal] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', location: '', salaryMin: '', salaryMax: '', duration: 36,
        articleshipType: 'full-time', requirements: [''], skills: [''], benefits: [''],
        externalLink: '', firmName: ''
    });

    const handleArrayField = (field, idx, val) => { const arr = [...form[field]]; arr[idx] = val; setForm({ ...form, [field]: arr }); };
    const addArrayItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
    const removeArrayItem = (field, idx) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== idx) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.location) return toast.error('Title, description and location are required');
        if (isExternal && !form.externalLink) return toast.error('External link is required for external job listings');
        setLoading(true);
        try {
            const payload = {
                ...form,
                salaryMin: Number(form.salaryMin),
                salaryMax: Number(form.salaryMax),
                requirements: form.requirements.filter(Boolean),
                skills: form.skills.filter(Boolean),
                benefits: form.benefits.filter(Boolean),
                isExternal,
            };
            await api.post('/admin/jobs', payload);
            toast.success('Job posted by admin!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post job');
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

    return (
        <div className="page-container animate-fade-in max-w-3xl mx-auto">
            <h1 className="section-title mb-2">Post Job <span className="text-primary-600">(Admin)</span></h1>
            <p className="section-subtitle mb-8">Post a job directly as admin — no subscription required. You can also post external links to other company sites.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* External toggle */}
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><HiExternalLink className="text-primary-600 w-5 h-5" /> External Job Listing</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Turn on if this job is hosted on an external company website. Students will be redirected to apply.</p>
                        </div>
                        <button type="button" onClick={() => setIsExternal(!isExternal)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isExternal ? 'bg-primary-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isExternal ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    {isExternal && (
                        <div className="mt-4">
                            <label className="label-text">External Application URL <span className="text-red-500">*</span></label>
                            <input className="input-field" type="url" placeholder="https://company.com/apply" value={form.externalLink} onChange={e => setForm({ ...form, externalLink: e.target.value })} />
                        </div>
                    )}
                </div>

                <div className="card space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2"><HiBriefcase className="text-primary-600 w-5 h-5" /> Basic Info</h3>
                    <div><label className="label-text">Job Title <span className="text-red-500">*</span></label><input className="input-field" required placeholder="Senior Audit Associate" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                    <div><label className="label-text">Company / Firm Name</label><input className="input-field" placeholder="e.g. Deloitte India" value={form.firmName} onChange={e => setForm({ ...form, firmName: e.target.value })} /></div>
                    <div><label className="label-text">Description <span className="text-red-500">*</span></label><textarea className="input-field" rows="5" required placeholder="Detailed job description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="label-text">Location <span className="text-red-500">*</span></label><input className="input-field" required placeholder="Mumbai" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                        <div><label className="label-text">Type</label>
                            <select className="input-field" value={form.articleshipType} onChange={e => setForm({ ...form, articleshipType: e.target.value })}>
                                <option value="full-time">Full-time</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="label-text">Min Salary (₹/mo)</label><input type="number" className="input-field" placeholder="15000" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} /></div>
                        <div><label className="label-text">Max Salary (₹/mo)</label><input type="number" className="input-field" placeholder="25000" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} /></div>
                        <div><label className="label-text">Duration (months)</label><input type="number" className="input-field" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
                    </div>
                </div>

                <div className="card space-y-4">
                    <h3 className="font-semibold text-gray-900">Details</h3>
                    {renderArrayInput("Requirements", "requirements", "e.g., CA Inter passed")}
                    {renderArrayInput("Skills Needed", "skills", "e.g., Taxation")}
                    {renderArrayInput("Benefits", "benefits", "e.g., Flexible hours")}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">{loading ? 'Posting...' : 'Post Job as Admin'}</button>
            </form>
        </div>
    );
}
