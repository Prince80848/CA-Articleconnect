import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs } from '../../redux/slices/jobSlice';
import { HiBriefcase, HiEye, HiUsers, HiPlusCircle, HiInformationCircle } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageJobs() {
    const dispatch = useDispatch();
    const { profile } = useSelector(state => state.auth);
    const { myJobs, loading } = useSelector(s => s.jobs);
    useEffect(() => { dispatch(fetchMyJobs()); }, [dispatch]);

    const closeJob = async (id) => {
        try { await api.post(`/jobs/${id}/close`); dispatch(fetchMyJobs()); toast.success('Job closed'); }
        catch (err) { toast.error('Failed'); }
    };

    const deleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this job overview?")) return;
        try { await api.delete(`/jobs/${id}`); dispatch(fetchMyJobs()); toast.success('Job deleted'); }
        catch (err) { toast.error('Failed to delete job'); }
    };

    const isPendingApproval = profile && profile.isVerified === false;

    return (
        <div className="page-container animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="section-title">Manage <span className="text-primary-600">Jobs</span></h1><p className="section-subtitle">View and manage your posted positions</p></div>
                {!isPendingApproval && (
                    <Link to="/firm/post-job" className="btn-primary flex items-center gap-2"><HiPlusCircle className="w-5 h-5" /> Post New</Link>
                )}
            </div>

            {isPendingApproval ? (
                <div className="card text-center py-16 px-4">
                    <HiInformationCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Your firm registration is currently under review by our admin team. You will be able to post and manage jobs once your account is verified. This usually takes 24-48 hours.
                    </p>
                    <Link to="/firm/dashboard" className="btn-primary">Return to Dashboard</Link>
                </div>
            ) : loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : myJobs.length > 0 ? (
                <div className="space-y-3">
                    {myJobs.map(job => (
                        <div key={job._id} className="card-hover">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center"><HiBriefcase className="w-5 h-5 text-primary-600" /></div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                            <span>{job.location}</span>
                                            <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" /> {job.viewsCount} views</span>
                                            <span className="flex items-center gap-1"><HiUsers className="w-3.5 h-3.5" /> {job.applicationsCount} apps</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{job.status}</span>
                                    {job.status === 'active' && <button onClick={() => closeJob(job._id)} className="btn-secondary !py-1.5 !px-3 text-xs">Close</button>}
                                    <button onClick={() => deleteJob(job._id)} className="btn-secondary !py-1.5 !px-3 text-xs !text-red-600 !border-red-200 hover:!bg-red-50">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <HiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">No Jobs Posted</h3>
                    <p className="text-gray-500 text-sm mb-4">Start posting jobs to find candidates.</p>
                    <Link to="/firm/post-job" className="btn-primary">Post Your First Job</Link>
                </div>
            )}
        </div>
    );
}
