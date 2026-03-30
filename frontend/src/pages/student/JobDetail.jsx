import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '../../redux/slices/jobSlice';
import { applyToJob } from '../../redux/slices/applicationSlice';
import { HiLocationMarker, HiCurrencyRupee, HiClock, HiUsers, HiEye, HiArrowLeft, HiCheck, HiOfficeBuilding, HiUpload, HiExternalLink, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function JobDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { currentJob: job, loading } = useSelector(s => s.jobs);
    const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => { dispatch(fetchJobById(id)); }, [dispatch, id]);

    // Pre-fill name and email from logged-in user
    useEffect(() => {
        if (user) setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
    }, [user]);

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return toast.error('File size must be less than 5MB');
        setResumeFile(file);
    };

    const uploadResume = async () => {
        if (!resumeFile) return null;
        const formData = new FormData();
        formData.append('resume', resumeFile);
        try {
            const { data } = await api.post('/students/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.data?.resumeUrl || data.url;
        } catch (err) {
            console.error('Resume upload failed:', err);
            toast.error('Resume upload failed. Please try again.');
            return null;
        }
    };

    const [upgradeRequired, setUpgradeRequired] = useState(false);

    const handleApply = async () => {
        if (!form.name.trim()) return toast.error('Your name is required');
        if (!form.email.trim()) return toast.error('Your email is required');
        if (!form.phone.trim()) return toast.error('Your phone number is required');
        if (!resumeFile) return toast.error('Please upload your resume to apply');

        setUploading(true);
        const resumeUrl = await uploadResume();
        setUploading(false);

        if (!resumeUrl) return toast.error('Resume upload failed, please try again');

        setApplying(true);
        try {
            const { data } = await api.post('/applications', {
                jobId: id,
                coverLetter: form.coverLetter,
                resumeUrl,
                applicantName: form.name,
                applicantEmail: form.email,
                applicantPhone: form.phone
            });
            setApplied(true);
            toast.success('Application submitted!');
        } catch (err) {
            if (err.response?.data?.upgradeRequired) {
                setUpgradeRequired(true);
                toast.error(err.response.data.message);
            } else {
                toast.error(err.response?.data?.message || 'Failed to apply');
            }
        }
        setApplying(false);
    };

    if (loading || !job) return <div className="page-container text-center py-20"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    return (
        <div className="page-container animate-fade-in">
            <Link to={user?.role === 'student' ? "/student/jobs" : "/jobs"} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6"><HiArrowLeft className="w-4 h-4" /> Back to jobs</Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0"><HiOfficeBuilding className="w-6 h-6 text-primary-600" /></div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                                <p className="text-gray-500">{job.firmId?.firmName}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4" /> {job.location}</span>
                            <span className="flex items-center gap-1"><HiCurrencyRupee className="w-4 h-4" /> ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}/month</span>
                            <span className="flex items-center gap-1"><HiClock className="w-4 h-4" /> {job.duration} months</span>
                            <span className="badge-primary">{job.articleshipType}</span>
                            {job.isExternal && <span className="badge-warning flex items-center gap-1"><HiExternalLink className="w-3 h-3" /> External Listing</span>}
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</div>
                    </div>

                    {job.requirements?.length > 0 && (
                        <div className="card"><h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                            <ul className="space-y-2">{job.requirements.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><HiCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />{r}</li>)}</ul></div>
                    )}

                    {job.skills?.length > 0 && (
                        <div className="card"><h3 className="font-semibold text-gray-900 mb-3">Skills Required</h3>
                            <div className="flex flex-wrap gap-2">{job.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">{s}</span>)}</div></div>
                    )}

                    {job.benefits?.length > 0 && (
                        <div className="card"><h3 className="font-semibold text-gray-900 mb-3">Benefits</h3>
                            <ul className="space-y-2">{job.benefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><HiCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />{b}</li>)}</ul></div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-4">Apply to this Position</h3>
                        {user?.role === 'student' ? (
                            applied ? (
                                <div className="text-center py-4"><HiCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" /><p className="font-medium text-gray-900">Application Submitted!</p><p className="text-sm text-gray-500 mt-1">You'll hear back from the firm soon.</p></div>
                            ) : upgradeRequired ? (
                                <div className="text-center py-6">
                                    <HiStar className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                    <h4 className="font-bold text-gray-900 mb-2">Free Limit Reached</h4>
                                    <p className="text-sm text-gray-500 mb-4">You've used all 5 free applications. Upgrade to Premium or Pro for unlimited applications.</p>
                                    <Link to="/student/premium" className="btn-primary inline-flex items-center gap-2"><HiStar className="w-4 h-4" /> Upgrade Now</Link>
                                </div>
                            ) : job.isExternal && job.externalLink ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">This is an external job listing. Click the button below to apply on the company's website.</p>
                                    <a href={job.externalLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full flex items-center justify-center gap-2">
                                        <HiExternalLink className="w-4 h-4" /> Apply on Company Site
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <label className="label-text">Full Name <span className="text-red-500">*</span></label>
                                        <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="label-text">Email <span className="text-red-500">*</span></label>
                                        <input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="label-text">Phone Number <span className="text-red-500">*</span></label>
                                        <input className="input-field" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="label-text">Resume <span className="text-red-500">*</span></label>
                                        <label className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${resumeFile ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}>
                                            <HiUpload className={`w-6 h-6 mb-2 ${resumeFile ? 'text-primary-500' : 'text-gray-400'}`} />
                                            <span className="text-sm text-center">
                                                {resumeFile ? <span className="text-primary-700 font-medium">{resumeFile.name}</span> : <><span className="font-medium text-gray-700">Click to upload resume</span><br /><span className="text-gray-400 text-xs">PDF, DOC, DOCX up to 5MB</span></>}
                                            </span>
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="label-text">Cover Letter <span className="text-gray-400 text-xs">(optional)</span></label>
                                        <textarea className="input-field" rows="3" placeholder="Why are you a good fit?" value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} />
                                    </div>
                                    <button onClick={handleApply} disabled={applying || uploading} className="btn-primary w-full">
                                        {uploading ? 'Uploading Resume...' : applying ? 'Applying...' : 'Submit Application'}
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-6">
                                <HiOfficeBuilding className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 mb-4">You must be logged in as a student to apply for articleships.</p>
                                <Link to="/login" className="btn-primary inline-flex">Login as Student</Link>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-3">Job Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm"><span className="text-gray-500 flex items-center gap-2"><HiEye className="w-4 h-4" /> Views</span><span className="font-medium text-gray-900">{job.viewsCount || 0}</span></div>
                            <div className="flex items-center justify-between text-sm"><span className="text-gray-500 flex items-center gap-2"><HiUsers className="w-4 h-4" /> Applications</span><span className="font-medium text-gray-900">{job.applicationsCount || 0}</span></div>
                            <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Posted</span><span className="font-medium text-gray-900">{new Date(job.postedDate || job.createdAt).toLocaleDateString()}</span></div>
                            {job.deadline && <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Deadline</span><span className="font-medium text-gray-900">{new Date(job.deadline).toLocaleDateString()}</span></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
