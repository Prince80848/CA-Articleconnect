import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '../../redux/slices/applicationSlice';
import { HiClipboardList } from 'react-icons/hi';

const statusColors = { applied: 'badge-info', shortlisted: 'badge-warning', interviewed: 'badge-primary', offered: 'badge-success', hired: 'badge-success', rejected: 'badge-danger', withdrawn: 'badge-danger' };

export default function MyApplications() {
    const dispatch = useDispatch();
    const { applications, loading } = useSelector(s => s.applications);

    useEffect(() => { dispatch(fetchMyApplications()); }, [dispatch]);

    const pipeline = ['applied', 'shortlisted', 'interviewed', 'offered', 'hired'];

    return (
        <div className="page-container animate-fade-in">
            <h1 className="section-title mb-1">My <span className="text-primary-600">Applications</span></h1>
            <p className="section-subtitle mb-6">Track the status of your submitted applications</p>

            {/* Pipeline Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {pipeline.map(s => {
                    const count = applications.filter(a => a.jobId && a.status === s).length;
                    return (
                        <div key={s} className="card text-center">
                            <p className="text-xl font-bold text-gray-900">{count}</p>
                            <p className="text-xs text-gray-500 capitalize">{s}</p>
                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : applications.length > 0 ? (
                <div className="table-container">
                    <table>
                        <thead><tr><th>Position</th><th>Firm</th><th>Status</th><th>Applied</th></tr></thead>
                        <tbody>
                            {applications.filter(app => app.jobId).map(app => (
                                <tr key={app._id}>
                                    <td className="font-medium text-gray-900">{app.jobId.title}</td>
                                    <td className="text-gray-500">{app.jobId.firmId?.firmName}</td>
                                    <td><span className={statusColors[app.status] || 'badge-info'}>{app.status}</span></td>
                                    <td className="text-gray-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card text-center py-12">
                    <HiClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No applications yet. Start browsing jobs!</p>
                </div>
            )}
        </div>
    );
}
