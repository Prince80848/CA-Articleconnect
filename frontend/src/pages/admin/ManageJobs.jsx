import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiEye, HiUsers, HiPlusCircle, HiTrash, HiExternalLink, HiX, HiCheck, HiPencil } from 'react-icons/hi';
import api from '../../services/api';
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
        setUpdating(true); setOpen(false);
        await onUpdate(app._id, status);
        setUpdating(false);
    };
    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} disabled={updating}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border capitalize ${statusColors[app.status] || 'badge-info'} ${updating ? 'opacity-60' : 'hover:opacity-80 cursor-pointer'}`}>
                {updating ? '...' : app.status} <span className="ml-0.5">▾</span>
            </button>
            {open && (
                <><div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1">
                        {ALL_STATUSES.map(s => (
                            <button key={s} onClick={() => handleSelect(s)}
                                className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 capitalize ${s === app.status ? 'text-primary-600 bg-primary-50' : 'text-gray-700'}`}>{s}</button>
                        ))}
                    </div></>
            )}
        </div>
    );
}

export default function AdminManageJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editJob, setEditJob] = useState(null);
    const [saving, setSaving] = useState(false);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/jobs?limit=100&status=active');
            setJobs(data.data.jobs || []);
        } catch { toast.error('Failed to load jobs'); }
        setLoading(false);
    };

    useEffect(() => { loadJobs(); }, []);

    const loadApplications = async (jobId) => {
        try {
            const { data } = await api.get(`/jobs/${jobId}/applications`);
            setApplications(data.data || []);
            setSelectedJob(jobId);
        } catch { toast.error('Failed to load applications'); }
    };

    const updateStatus = async (appId, status) => {
        try {
            await api.put(`/applications/${appId}`, { status });
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
            toast.success(`Status updated to "${status}"`);
        } catch { toast.error('Failed to update status'); }
    };

    const deleteJob = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try { await api.delete(`/jobs/${id}`); toast.success('Job deleted'); loadJobs(); setSelectedJob(null); }
        catch { toast.error('Failed to delete job'); }
    };

    const saveEdit = async () => {
        setSaving(true);
        try {
            await api.put(`/jobs/${editJob._id}`, editJob);
            toast.success('Job updated!');
            setEditJob(null);
            loadJobs();
        } catch { toast.error('Failed to update job'); }
        setSaving(false);
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="section-title">Manage <span className="text-primary-600">All Jobs</span></h1><p className="section-subtitle">View, edit, or delete job listings and manage applicants</p></div>
                <Link to="/admin/post-job" className="btn-primary flex items-center gap-2"><HiPlusCircle className="w-5 h-5" /> Post New Job</Link>
            </div>

            {loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Jobs List */}
                    <div className="space-y-3">
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Job Listings ({jobs.length})</h2>
                        {jobs.length === 0 ? (
                            <div className="card text-center py-12">
                                <HiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No jobs yet. <Link to="/admin/post-job" className="text-primary-600">Post one now</Link></p>
                            </div>
                        ) : jobs.map(job => (
                            <div key={job._id} className={`card-hover cursor-pointer transition-all ${selectedJob === job._id ? 'ring-2 ring-primary-500' : ''}`} onClick={() => loadApplications(job._id)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0"><HiBriefcase className="w-4 h-4 text-primary-600" /></div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{job.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{job.location}</span>
                                                <span className="flex items-center gap-0.5"><HiUsers className="w-3 h-3" />{job.applicationsCount}</span>
                                                {job.isExternal && <span className="flex items-center gap-0.5 text-blue-500"><HiExternalLink className="w-3 h-3" />External</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        <button onClick={e => { e.stopPropagation(); setEditJob({ ...job }); }}
                                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                                            <HiPencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={e => { e.stopPropagation(); deleteJob(job._id); }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Applications Panel */}
                    <div>
                        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">
                            {selectedJob ? `Applications (${applications.length})` : 'Select a job to view applicants'}
                        </h2>
                        {selectedJob ? (
                            applications.length === 0 ? (
                                <div className="card text-center py-10"><p className="text-gray-500 text-sm">No applications for this job yet.</p></div>
                            ) : (
                                <div className="space-y-2">
                                    {applications.map(app => (
                                        <div key={app._id} className="card p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{app.applicantName || app.studentId?.userId?.name}</p>
                                                    <p className="text-xs text-gray-500">{app.applicantEmail || app.studentId?.userId?.email}</p>
                                                    {app.applicantPhone && <p className="text-xs text-gray-500">{app.applicantPhone}</p>}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {app.resumeUrl && (
                                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                                                            className="text-xs text-primary-600 border border-primary-200 rounded-lg px-2 py-1 hover:bg-primary-50 transition-colors">Resume</a>
                                                    )}
                                                    <StatusDropdown app={app} onUpdate={updateStatus} />
                                                </div>
                                            </div>
                                            {app.coverLetter && <p className="mt-2 text-xs text-gray-600 border-t pt-2">{app.coverLetter}</p>}
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="card text-center py-16"><HiEye className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Click a job on the left to see its applicants here</p></div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Job Modal */}
            {editJob && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Edit Job</h2>
                            <button onClick={() => setEditJob(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="label-text">Job Title</label><input className="input-field" value={editJob.title} onChange={e => setEditJob({ ...editJob, title: e.target.value })} /></div>
                            <div><label className="label-text">Location</label><input className="input-field" value={editJob.location} onChange={e => setEditJob({ ...editJob, location: e.target.value })} /></div>
                            <div><label className="label-text">Description</label><textarea className="input-field" rows="4" value={editJob.description} onChange={e => setEditJob({ ...editJob, description: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="label-text">Min Salary</label><input type="number" className="input-field" value={editJob.salaryMin} onChange={e => setEditJob({ ...editJob, salaryMin: e.target.value })} /></div>
                                <div><label className="label-text">Max Salary</label><input type="number" className="input-field" value={editJob.salaryMax} onChange={e => setEditJob({ ...editJob, salaryMax: e.target.value })} /></div>
                            </div>
                            {editJob.isExternal && (
                                <div><label className="label-text">External Link</label><input className="input-field" type="url" value={editJob.externalLink} onChange={e => setEditJob({ ...editJob, externalLink: e.target.value })} /></div>
                            )}
                            <div><label className="label-text">Status</label>
                                <select className="input-field" value={editJob.status} onChange={e => setEditJob({ ...editJob, status: e.target.value })}>
                                    <option value="active">Active</option><option value="closed">Closed</option><option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={saveEdit} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <HiCheck className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditJob(null)} className="btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
