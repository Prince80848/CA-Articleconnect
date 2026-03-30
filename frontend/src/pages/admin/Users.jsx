import { useEffect, useState } from 'react';
import { HiSearch, HiUser } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = () => {
        setLoading(true);
        api.get('/admin/users', { params: { search, role: roleFilter } }).then(r => setUsers(r.data.data?.users || [])).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, [roleFilter]);

    const toggleStatus = async (id, isActive) => {
        try { await api.put(`/admin/users/${id}`, { isActive: !isActive }); fetchUsers(); toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`); }
        catch (err) { toast.error('Failed'); }
    };

    return (
        <div className="page-container animate-fade-in">
            <h1 className="section-title mb-1">User <span className="text-primary-600">Management</span></h1>
            <p className="section-subtitle mb-6">Manage all platform users</p>

            <div className="card mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative"><HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input className="input-field pl-10" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchUsers()} /></div>
                    <select className="input-field w-full sm:w-36" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}><option value="">All Roles</option><option value="student">Student</option><option value="firm">Firm</option><option value="admin">Admin</option></select>
                    <button onClick={fetchUsers} className="btn-primary">Search</button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : users.length > 0 ? (
                <div className="table-container">
                    <table>
                        <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center"><span className="text-primary-600 text-xs font-bold">{u.name?.[0]?.toUpperCase()}</span></div><div><p className="text-sm font-medium text-gray-900">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div></div></td>
                                    <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'firm' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                                    <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td><button onClick={() => toggleStatus(u._id, u.isActive)} className={`text-xs font-medium px-3 py-1 rounded-lg ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <div className="card text-center py-12"><HiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No users found.</p></div>}
        </div>
    );
}
