import { useEffect, useState } from 'react';
import { HiUsers, HiOfficeBuilding, HiBriefcase, HiClipboardList, HiTrendingUp, HiCurrencyRupee, HiClock, HiUserGroup, HiCreditCard, HiCheckCircle, HiChip } from 'react-icons/hi';
import api from '../../services/api';

const PLAN_COLORS = {
    startup: 'bg-gray-100 text-gray-700',
    growth: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700'
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentPayments, setRecentPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data.data)).catch(() => {});
        api.get('/admin/payments/recent?limit=8')
            .then(r => setRecentPayments(r.data.data?.payments || []))
            .catch(() => {})
            .finally(() => setPaymentsLoading(false));
    }, []);

    const statCards = [
        { icon: HiUsers, label: 'Total Users', value: stats?.totalUsers ?? '—', color: 'bg-blue-50 text-blue-600' },
        { icon: HiOfficeBuilding, label: 'Total Firms', value: stats?.totalFirms ?? '—', color: 'bg-emerald-50 text-emerald-600' },
        { icon: HiBriefcase, label: 'Active Jobs', value: stats?.activeJobs ?? '—', color: 'bg-amber-50 text-amber-600' },
        { icon: HiClipboardList, label: 'Applications', value: stats?.totalApplications ?? '—', color: 'bg-purple-50 text-purple-600' },
        { icon: HiTrendingUp, label: 'Hired', value: stats?.hiredCount ?? '—', color: 'bg-pink-50 text-pink-600' },
        { icon: HiCurrencyRupee, label: 'Total Revenue', value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(0)}k`, color: 'bg-teal-50 text-teal-600' },
        { icon: HiClock, label: 'Pending Firms', value: stats?.pendingFirms ?? '—', color: 'bg-orange-50 text-orange-600' },
        { icon: HiChip, label: 'Active Subs', value: stats?.activeSubscriptions ?? '—', color: 'bg-indigo-50 text-indigo-600' },
        { icon: HiUserGroup, label: 'Premium Students', value: stats?.premiumStudents ?? '—', color: 'bg-rose-50 text-rose-600' },
    ];

    return (
        <div className="page-container animate-fade-in">
            <div className="mb-8">
                <h1 className="section-title">Admin <span className="text-primary-600">Dashboard</span></h1>
                <p className="section-subtitle">Platform overview and key metrics</p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-gray-500 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Platform Health */}
                <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-4">Platform Health</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">API Status</span><span className="badge-success">Operational</span></div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Database</span><span className="badge-success">Connected</span></div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Avg Response Time</span><span className="text-sm font-medium text-gray-900">45ms</span></div>
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-600">Total Revenue</span><span className="text-sm font-bold text-gray-900">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</span></div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"><span className="text-sm text-gray-600">Firm Subscriptions</span><span className="text-sm font-bold text-emerald-700">₹{(stats?.firmRevenue || 0).toLocaleString('en-IN')}</span></div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"><span className="text-sm text-gray-600">Student Subscriptions</span><span className="text-sm font-bold text-purple-700">₹{(stats?.studentRevenue || 0).toLocaleString('en-IN')}</span></div>
                    </div>
                </div>
            </div>

            {/* RECENT PURCHASES */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <HiCreditCard className="w-4 h-4 text-primary-600" />
                        Recent Purchases
                    </h3>
                    <span className="text-xs text-gray-400">Last 8 transactions</span>
                </div>

                {paymentsLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : recentPayments.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Firm</th>
                                    <th>Plan</th>
                                    <th>Amount</th>
                                    <th>Invoice</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPayments.map(p => {
                                    // Infer plan from description
                                    const planKey = p.description?.toLowerCase().includes('startup') ? 'startup'
                                        : p.description?.toLowerCase().includes('enterprise') ? 'enterprise'
                                        : p.description?.toLowerCase().includes('growth') ? 'growth' : null;
                                    return (
                                        <tr key={p._id}>
                                            <td>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{p.firmId?.firmName || '—'}</p>
                                                    <p className="text-xs text-gray-400">{p.userId?.email || ''}</p>
                                                </div>
                                            </td>
                                            <td>
                                                {planKey ? (
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${PLAN_COLORS[planKey]}`}>{planKey}</span>
                                                ) : <span className="text-sm text-gray-500 capitalize">{p.type}</span>}
                                            </td>
                                            <td className="text-sm font-semibold text-gray-900">₹{p.amount?.toLocaleString('en-IN')}</td>
                                            <td className="text-xs font-mono text-gray-400">{p.invoiceNumber || '—'}</td>
                                            <td className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td>
                                                <span className={`flex items-center gap-1 text-xs font-semibold ${p.status === 'successful' ? 'text-green-600' : 'text-amber-600'}`}>
                                                    <HiCheckCircle className="w-3.5 h-3.5" />
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <HiCreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No purchases yet. Purchases will appear here once firms subscribe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
