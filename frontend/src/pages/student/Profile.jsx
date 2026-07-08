import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiUser, HiSave, HiStar, HiLightningBolt, HiShieldCheck, HiDocumentText, HiUpload, HiCheck, HiEye, HiDownload, HiTrash } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';


export default function StudentProfile() {
    const { user } = useSelector(s => s.auth);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [premium, setPremium] = useState(null);
    const [totalApplications, setTotalApplications] = useState(0);
    const [resumeUrl, setResumeUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

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
            setResumeUrl(d.resume || '');
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

    const handleResumeUpload = async (file) => {
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(ext)) {
            toast.error('Only PDF, DOC, or DOCX files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB.');
            return;
        }
        const formData = new FormData();
        formData.append('resume', file);
        setUploading(true);
        try {
            const { data } = await api.post('/students/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResumeUrl(data.data.resumeUrl);
            toast.success('Resume uploaded successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleResumeUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleResumeUpload(file);
    };

    const handleRemoveResume = async () => {
        try {
            await api.put('/students/me', { resume: '' });
            setResumeUrl('');
            toast.success('Resume removed.');
        } catch {
            toast.error('Failed to remove resume.');
        }
    };

    const getFileName = (url) => {
        if (!url) return 'resume.pdf';
        const parts = url.split('/');
        return decodeURIComponent(parts[parts.length - 1]) || 'resume.pdf';
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
                {/* Left column */}
                <div className="space-y-6">
                    {/* Avatar card */}
                    <div className="card text-center">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiUser className="w-10 h-10 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <p className="text-primary-600 text-sm font-medium mt-2 capitalize">{form.currentStatus}</p>
                    </div>

                    {/* Resume Card */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <HiDocumentText className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">Resume / CV</h3>
                        </div>

                        {resumeUrl ? (
                            /* Resume already uploaded — show it */
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <HiCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-green-800">Resume Uploaded</p>
                                        <p className="text-xs text-green-600 truncate mt-0.5">{getFileName(resumeUrl)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 transition-colors"
                                    >
                                        <HiEye className="w-3.5 h-3.5" /> View
                                    </a>
                                    <a
                                        href={`/api/students/resume-download?url=${encodeURIComponent(resumeUrl)}`}
                                        download={resumeUrl.split('/').pop().split('?')[0] || 'resume.pdf'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <HiDownload className="w-3.5 h-3.5" /> Download
                                    </a>
                                    <button
                                        onClick={handleRemoveResume}
                                        className="flex items-center justify-center w-9 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                        title="Remove resume"
                                    >
                                        <HiTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                {/* Replace */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full text-xs text-gray-500 hover:text-primary-600 transition-colors py-1 flex items-center justify-center gap-1"
                                >
                                    <HiUpload className="w-3 h-3" />
                                    {uploading ? 'Uploading...' : 'Replace resume'}
                                </button>
                            </div>
                        ) : (
                            /* Upload drop zone */
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                                    dragOver
                                        ? 'border-primary-400 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm text-primary-600 font-medium">Uploading...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <HiUpload className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">Drop your resume here</p>
                                        <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                                        <p className="text-xs text-gray-400 mt-3">PDF, DOC, DOCX • Max 5 MB</p>
                                    </>
                                )}
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
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
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="font-semibold text-green-600">Active ✓</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Plan</span><span className="font-semibold text-gray-900 capitalize">{premium?.plan}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Expires</span><span className="text-gray-700">{new Date(premium?.expiryDate).toLocaleDateString('en-IN')}</span></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Applications Used</span><span className="font-semibold text-gray-900">{totalApplications} / 5</span></div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                    <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((totalApplications / 5) * 100, 100)}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{totalApplications >= 5 ? 'You have used all free applications.' : `${5 - totalApplications} free applications remaining.`}</p>
                                <Link to="/student/premium" className="btn-primary w-full text-center block mt-3 text-sm">Upgrade to Premium</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card space-y-4">
                        <h3 className="font-semibold text-gray-900">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label-text">ICAI Registration</label><input className="input-field" placeholder="WRO0XXXXXX" value={form.icaiRegistration} onChange={e => setForm({ ...form, icaiRegistration: e.target.value })} /></div>
                            <div><label className="label-text">College</label><input className="input-field" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} /></div>
                            <div><label className="label-text">Graduation Year</label><input type="number" className="input-field" value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} /></div>
                            <div><label className="label-text">Current Status</label>
                                <select className="input-field" value={form.currentStatus} onChange={e => setForm({ ...form, currentStatus: e.target.value })}>
                                    <option value="looking">Looking for Articleship</option>
                                    <option value="in-discussions">In Discussions</option>
                                    <option value="hired">Hired</option>
                                </select>
                            </div>
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
