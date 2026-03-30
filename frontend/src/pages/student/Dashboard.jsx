import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiClipboardList, HiChat, HiStar, HiEye, HiArrowRight, HiBriefcase } from 'react-icons/hi';
import api from '../../services/api';

export default function StudentDashboard() {
    const { user } = useSelector(s => s.auth);
    const [stats, setStats] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);

    useEffect(() => {
        api.get('/analytics/dashboard').then(r => setStats(r.data.data)).catch(() => { });
        api.get('/jobs?limit=5&sort=-postedDate').then(r => setRecentJobs(r.data.data?.jobs || [])).catch(() => { });
    }, []);

    const cards = [
        { icon: HiClipboardList, label: 'Applications', value: stats?.totalApplications || 0, color: 'bg-blue-50 text-blue-600' },
        { icon: HiChat, label: 'Interviews', value: stats?.interviewCount || 0, color: 'bg-amber-50 text-amber-600' },
        { icon: HiStar, label: 'Offers', value: stats?.offerCount || 0, color: 'bg-emerald-50 text-emerald-600' },
        { icon: HiEye, label: 'Profile Views', value: stats?.profileViews || 0, color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="page-container animate-fade-in">
            <div className="mb-8">
                <h1 className="section-title">Welcome back, <span className="text-primary-600">{user?.name}</span> 👋</h1>
                <p className="section-subtitle">Here's what's happening with your articleship journey</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
                            <HiArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-gray-500 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Recent Applications</h3>
                        <Link to="/student/applications" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">View All <HiArrowRight className="w-3 h-3" /></Link>
                    </div>
                    {stats?.recentApplications?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentApplications.filter(app => app.jobId).map((app, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                    <div><p className="text-sm font-medium text-gray-900">{app.jobId.title}</p><p className="text-xs text-gray-500">{app.jobId.firmId?.firmName}</p></div>
                                    <span className={`badge ${app.status === 'applied' ? 'badge-info' : app.status === 'shortlisted' ? 'badge-warning' : 'badge-success'}`}>{app.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400 text-sm py-6 text-center">No applications yet. Start browsing jobs!</p>}
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Latest Jobs</h3>
                        <Link to="/student/jobs" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">Browse All <HiArrowRight className="w-3 h-3" /></Link>
                    </div>
                    {recentJobs.length > 0 ? (
                        <div className="space-y-3">
                            {recentJobs.map(job => (
                                <Link key={job._id} to={`/student/jobs/${job._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center"><HiBriefcase className="w-4 h-4 text-primary-600" /></div>
                                        <div><p className="text-sm font-medium text-gray-900">{job.title}</p><p className="text-xs text-gray-500">{job.firmId?.firmName} • {job.location}</p></div>
                                    </div>
                                    <span className="text-sm text-primary-600 font-medium">₹{(job.salaryMin / 1000).toFixed(0)}k</span>
                                </Link>
                            ))}
                        </div>
                    ) : <p className="text-gray-400 text-sm py-6 text-center">No jobs available yet.</p>}
                </div>
            </div>
        </div>
    );
}
