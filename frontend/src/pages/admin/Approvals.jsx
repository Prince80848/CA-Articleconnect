import { useEffect, useState } from 'react';
import { HiCheck, HiX, HiOfficeBuilding } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Approvals() {
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = () => {
        setLoading(true);
        api.get('/admin/firms/pending').then(r => setFirms(Array.isArray(r.data.data) ? r.data.data : [])).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { fetchPending(); }, []);

    const handleAction = async (id, action) => {
        try { await api.put(`/admin/firms/${id}/${action}`); fetchPending(); toast.success(`Firm ${action}d!`); }
        catch (err) { toast.error('Failed'); }
    };

    return (
        <div className="page-container animate-fade-in">
            <h1 className="section-title mb-1">Firm <span className="text-primary-600">Approvals</span></h1>
            <p className="section-subtitle mb-8">Review and approve new firm registrations</p>

            {loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : firms.length > 0 ? (
                <div className="space-y-3">
                    {firms.map(f => (
                        <div key={f._id} className="card-hover">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center"><HiOfficeBuilding className="w-5 h-5 text-amber-600" /></div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{f.firmName}</h3>
                                        <p className="text-sm text-gray-500">{f.userId?.email} • {f.userId?.phone || 'No phone'} • {f.registrationNumber}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{f.address?.city}, {f.address?.state}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleAction(f._id, 'approve')} className="btn-success !py-1.5 !px-4 text-sm flex items-center gap-1"><HiCheck className="w-4 h-4" /> Approve</button>
                                    <button onClick={() => handleAction(f._id, 'reject')} className="btn-danger !py-1.5 !px-4 text-sm flex items-center gap-1"><HiX className="w-4 h-4" /> Reject</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <HiOfficeBuilding className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">No Pending Approvals</h3>
                    <p className="text-gray-500 text-sm">All firm registrations have been reviewed.</p>
                </div>
            )}
        </div>
    );
}
