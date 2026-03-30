import { useEffect, useState } from 'react';
import { HiChartBar, HiBriefcase, HiUsers, HiCurrencyRupee, HiLocationMarker, HiClipboardList } from 'react-icons/hi';
import api from '../../services/api';

function StatRow({ label, value, accent }) {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">{label}</span>
            <span className={`text-sm font-bold ${accent ? 'text-primary-600' : 'text-gray-900'}`}>{value}</span>
        </div>
    );
}

export default function Analytics() {
    const [data, setData] = useState(null);
    const [adminStats, setAdminStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/analytics/platform').catch(() => ({ data: { data: null } })),
            api.get('/admin/stats').catch(() => ({ data: { data: null } }))
        ]).then(([platformRes, adminRes]) => {
            setData(platformRes.data.data);
            setAdminStats(adminRes.data.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="page-container text-center py-24"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

    return (
        <div className="page-container animate-fade-in">
            <h1 className="section-title mb-1">Platform <span className="text-primary-600">Analytics</span></h1>
            <p className="section-subtitle mb-8">Detailed insights into platform performance</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Users', value: adminStats?.totalUsers ?? 0, icon: HiUsers, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Total Jobs', value: adminStats?.totalJobs ?? data?.jobStats?.total ?? 0, icon: HiBriefcase, color: 'bg-primary-50 text-primary-600' },
                    { label: 'Applications', value: adminStats?.totalApplications ?? data?.applicationStats?.total ?? 0, icon: HiClipboardList, color: 'bg-amber-50 text-amber-600' },
                    { label: 'Hired', value: adminStats?.hiredCount ?? data?.applicationStats?.hired ?? 0, icon: HiChartBar, color: 'bg-emerald-50 text-emerald-600' },
                ].map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-gray-500 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Job Analytics */}
                <div className="card">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><HiBriefcase className="text-primary-600 w-5 h-5" /> Job Analytics</h3>
                    <div className="space-y-3">
                        <StatRow label="Total Jobs Posted" value={data?.jobStats?.total ?? 0} />
                        <StatRow label="Active Jobs" value={data?.jobStats?.active ?? 0} />
                        <StatRow label="Pending Firm Approvals" value={adminStats?.pendingFirms ?? 0} />
                        <StatRow label="Avg. Applications per Job" value={(data?.jobStats?.avgApplications ?? 0).toFixed(1)} />
                        <StatRow label="Avg. Salary Offered" value={`₹${Math.round(data?.jobStats?.avgSalary ?? 0).toLocaleString()}`} />
                    </div>
                </div>

                {/* Application Analytics */}
                <div className="card">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><HiUsers className="text-primary-600 w-5 h-5" /> Application Analytics</h3>
                    <div className="space-y-3">
                        <StatRow label="Total Applications" value={data?.applicationStats?.total ?? 0} />
                        <StatRow label="Shortlisted" value={data?.applicationStats?.shortlisted ?? 0} />
                        <StatRow label="Interviews Scheduled" value={data?.applicationStats?.interviewed ?? 0} />
                        <StatRow label="Offers Made" value={data?.applicationStats?.offered ?? 0} />
                        <StatRow label="Hired" value={data?.applicationStats?.hired ?? 0} accent />
                    </div>
                </div>

                {/* Revenue */}
                <div className="card">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><HiCurrencyRupee className="text-primary-600 w-5 h-5" /> Revenue</h3>
                    <div className="space-y-3">
                        <StatRow label="Active Subscriptions" value={adminStats?.activeSubscriptions ?? 0} />
                        <StatRow label="Firm Subscriptions Revenue" value={`₹${(data?.revenue?.firmSubscriptions ?? 0).toLocaleString()}`} />
                        <StatRow label="Student Premiums Revenue" value={`₹${(data?.revenue?.studentPremiums ?? 0).toLocaleString()}`} />
                        <StatRow label="Total Revenue" value={`₹${(data?.revenue?.total ?? adminStats?.totalRevenue ?? 0).toLocaleString()}`} accent />
                    </div>
                </div>

                {/* Top Locations */}
                <div className="card">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><HiLocationMarker className="text-primary-600 w-5 h-5" /> Top Locations</h3>
                    <div className="space-y-3">
                        {(data?.topLocations?.length > 0 ? data.topLocations : [
                            { location: 'No data yet', count: 0 }
                        ]).map((loc, i) => (
                            <StatRow key={i} label={loc.location || loc._id} value={`${loc.count} jobs`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
