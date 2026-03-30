import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../redux/slices/jobSlice';
import { HiSearch, HiLocationMarker, HiClock, HiCurrencyRupee, HiBriefcase } from 'react-icons/hi';

export default function BrowseJobs() {
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { jobs, total, loading } = useSelector(s => s.jobs);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => { dispatch(fetchJobs({ search, location, articleshipType: type, page, limit: 10 })); }, [dispatch, page]);

    const handleSearch = () => { setPage(1); dispatch(fetchJobs({ search, location, articleshipType: type, page: 1, limit: 10 })); };

    return (
        <div className="page-container animate-fade-in">
            <div className="mb-6">
                <h1 className="section-title">Browse <span className="text-primary-600">Articleships</span></h1>
                <p className="section-subtitle">Find the perfect opportunity for your CA journey</p>
            </div>

            {/* Search */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input className="input-field pl-10" placeholder="Search jobs, firms, keywords..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    </div>
                    <div className="relative w-full md:w-44">
                        <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input className="input-field pl-10" placeholder="City..." value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <select className="input-field w-full md:w-36" value={type} onChange={e => setType(e.target.value)}>
                        <option value="">All Types</option><option value="full-time">Full-time</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option>
                    </select>
                    <button onClick={handleSearch} className="btn-primary">Search Jobs</button>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">{total || jobs?.length || 0} jobs found</p>

            {loading ? (
                <div className="text-center py-16"><div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : jobs && jobs.length > 0 ? (
                <div className="space-y-3">
                    {jobs.map(job => (
                        <Link key={job._id} to={user?.role === 'student' ? `/student/jobs/${job._id}` : `/jobs/${job._id}`} className="card-hover block">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <HiBriefcase className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{job.firmId?.firmName || 'CA Firm'}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" /> {job.location}</span>
                                            <span className="flex items-center gap-1"><HiCurrencyRupee className="w-3.5 h-3.5" /> ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}</span>
                                            <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" /> {job.duration} months</span>
                                            <span className="badge-primary">{job.articleshipType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-400">{new Date(job.postedDate || job.createdAt).toLocaleDateString()}</p>
                                    <p className="text-xs text-primary-600 mt-1">{job.applicationsCount || 0} applicants</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : <div className="card text-center py-12"><HiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No jobs found. Try adjusting your filters.</p></div>}

            {total > 10 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary !py-2 !px-4 text-sm">Previous</button>
                    <span className="px-4 py-2 text-sm text-gray-500">Page {page}</span>
                    <button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary !py-2 !px-4 text-sm">Next</button>
                </div>
            )}
        </div>
    );
}
