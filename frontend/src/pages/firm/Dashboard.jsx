import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiUsers, HiClipboardList, HiTrendingUp, HiPlusCircle, HiArrowRight, HiInformationCircle } from 'react-icons/hi';
import api from '../../services/api';

export default function FirmDashboard() {
    const { profile } = useSelector(state => state.auth);
    const [stats, setStats] = useState(null);

    useEffect(() => { api.get('/analytics/dashboard').then(r => setStats(r.data.data)).catch(() => { }); }, []);

    const cards = [
        { icon: HiBriefcase, label: 'Total Jobs', value: stats?.totalJobs || 0, color: 'bg-blue-50 text-blue-600' },
        { icon: HiClipboardList, label: 'Active Jobs', value: stats?.activeJobs || 0, color: 'bg-emerald-50 text-emerald-600' },
        { icon: HiUsers, label: 'Applications', value: stats?.totalApplications || 0, color: 'bg-amber-50 text-amber-600' },
        { icon: HiTrendingUp, label: 'Hired', value: stats?.hiredCount || 0, color: 'bg-purple-50 text-purple-600' },
    ];
        
    const isPendingApproval = profile && profile.isVerified === false;

    return (
        <div className="page-container animate-fade-in">
            {isPendingApproval && (
                <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                    <HiInformationCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold">Account Pending Approval</h3>
                        <p className="text-sm mt-1 text-amber-700">Your firm registration is currently under review by our admin team. You won't be able to post jobs until your account is verified. This usually takes 24-48 hours.</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div><h1 className="section-title">Firm <span className="text-primary-600">Dashboard</span></h1><p className="section-subtitle">Manage your hiring pipeline</p></div>
                {!isPendingApproval && (
                    <Link to="/firm/post-job" className="btn-primary flex items-center gap-2"><HiPlusCircle className="w-5 h-5" /> Post New Job</Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-gray-500 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Recent Applications</h3>
                        <Link to="/firm/candidates" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">View All <HiArrowRight className="w-3 h-3" /></Link>
                    </div>
                    {stats?.recentApplications?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentApplications.map((app, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center"><span className="text-primary-600 text-xs font-bold">{app.studentId?.userId?.name?.[0] || '?'}</span></div>
                                        <div><p className="text-sm font-medium text-gray-900">{app.studentId?.userId?.name || 'Student'}</p><p className="text-xs text-gray-500">{app.jobId?.title}</p></div>
                                    </div>
                                    <span className={`badge ${app.status === 'applied' ? 'badge-info' : app.status === 'shortlisted' ? 'badge-warning' : 'badge-success'}`}>{app.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400 text-sm py-6 text-center">No applications yet.</p>}
                </div>

                <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        {isPendingApproval ? (
                             <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed">
                                 <HiPlusCircle className="w-5 h-5 text-gray-400" /><div><p className="font-medium text-gray-900 text-sm">Post New Job (Pending)</p><p className="text-xs text-gray-500">Requires admin approval</p></div>
                             </div>
                        ) : (
                            <Link to="/firm/post-job" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                <HiPlusCircle className="w-5 h-5 text-primary-600" /><div><p className="font-medium text-gray-900 text-sm">Post New Job</p><p className="text-xs text-gray-500">Create a new articleship listing</p></div>
                            </Link>
                        )}
                        <Link to="/firm/manage-jobs" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <HiBriefcase className="w-5 h-5 text-emerald-600" /><div><p className="font-medium text-gray-900 text-sm">Manage Jobs</p><p className="text-xs text-gray-500">Edit, close, or repost listings</p></div></Link>
                        <Link to="/firm/candidates" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            <HiUsers className="w-5 h-5 text-amber-600" /><div><p className="font-medium text-gray-900 text-sm">View Candidates</p><p className="text-xs text-gray-500">Review and manage applications</p></div></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
