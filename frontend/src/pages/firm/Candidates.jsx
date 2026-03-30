import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyApplications, updateApplicationStatus } from '../../redux/slices/applicationSlice';
import { HiUser, HiInformationCircle, HiPhone, HiMail, HiDocumentText, HiChevronDown } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ALL_STATUSES = ['applied', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'];
const statusColors = {
    applied: 'badge-info', shortlisted: 'badge-warning', interviewed: 'badge-primary',
    offered: 'badge-success', hired: 'badge-success', rejected: 'badge-danger', withdrawn: 'badge-danger'
};

function StatusDropdown({ app, onUpdate }) {
    const [open, setOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleSelect = async (status) => {
        if (status === app.status) { setOpen(false); return; }
        setUpdating(true);
        setOpen(false);
        await onUpdate(app._id, status);
        setUpdating(false);
    };

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} disabled={updating}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${statusColors[app.status] || 'badge-info'} ${updating ? 'opacity-60' : 'hover:opacity-80 cursor-pointer'}`}>
                {updating ? '...' : app.status}
                <HiChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1 overflow-hidden">
                        {ALL_STATUSES.map(s => (
                            <button key={s} onClick={() => handleSelect(s)}
                                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors capitalize ${s === app.status ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function Candidates() {
    const dispatch = useDispatch();
    const { profile } = useSelector(state => state.auth);
    const { applications, loading } = useSelector(s => s.applications);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => { dispatch(fetchMyApplications()); }, [dispatch]);

    const updateStatus = async (id, status) => {
        const result = await dispatch(updateApplicationStatus({ id, status }));
        if (updateApplicationStatus.fulfilled.match(result)) toast.success(`Status updated to "${status}"`);
        else toast.error('Failed to update status');
    };

    const isPendingApproval = profile && profile.isVerified === false;

    return (
        <div className="page-container animate-fade-in">
            <h1 className="section-title mb-1">Manage <span className="text-primary-600">Candidates</span></h1>
            <p className="section-subtitle mb-8">Review applicants, view resumes, and manage statuses</p>

            {isPendingApproval ? (
                <div className="card text-center py-16 px-4">
                    <HiInformationCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">Your firm is currently under review. You'll be able to review applications once verified.</p>
                    <Link to="/firm/dashboard" className="btn-primary">Return to Dashboard</Link>
                </div>
            ) : loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : applications.length > 0 ? (
                <div className="space-y-3">
                    {applications.map(app => (
                        <div key={app._id} className="card-hover">
                            {/* Main Row */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-primary-600 text-sm font-bold">{app.studentId?.userId?.name?.[0] || '?'}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{app.applicantName || app.studentId?.userId?.name || 'Student'}</p>
                                        <p className="text-xs text-gray-500">{app.jobId?.title}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Editable status dropdown */}
                                    <StatusDropdown app={app} onUpdate={updateStatus} />

                                    {/* Resume link */}
                                    {app.resumeUrl && (
                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium border border-primary-200 rounded-lg px-2 py-1 hover:bg-primary-50 transition-colors">
                                            <HiDocumentText className="w-3.5 h-3.5" /> Resume
                                        </a>
                                    )}

                                    <button onClick={() => setExpanded(expanded === app._id ? null : app._id)}
                                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        {expanded === app._id ? 'Hide' : 'Details'}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expanded === app._id && (
                                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant Info</h4>
                                        {(app.applicantEmail || app.studentId?.userId?.email) && (
                                            <p className="flex items-center gap-2 text-sm text-gray-700">
                                                <HiMail className="w-4 h-4 text-gray-400" />
                                                {app.applicantEmail || app.studentId?.userId?.email}
                                            </p>
                                        )}
                                        {app.applicantPhone && (
                                            <p className="flex items-center gap-2 text-sm text-gray-700">
                                                <HiPhone className="w-4 h-4 text-gray-400" />
                                                {app.applicantPhone}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {app.coverLetter && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cover Letter</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
                                        </div>
                                    )}
                                    {/* Status history */}
                                    {app.statusHistory?.length > 0 && (
                                        <div className="md:col-span-2 space-y-1">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status History</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {app.statusHistory.map((h, i) => (
                                                    <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                        {h.status} — {new Date(h.date).toLocaleDateString()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <HiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">No Applications</h3>
                    <p className="text-gray-500 text-sm">Applications appear here once students apply to your jobs.</p>
                </div>
            )}
        </div>
    );
}
