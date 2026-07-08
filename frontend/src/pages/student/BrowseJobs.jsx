import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../redux/slices/jobSlice';
import { HiSearch, HiLocationMarker, HiClock, HiCurrencyRupee, HiBriefcase, HiChevronLeft, HiChevronRight, HiFilter } from 'react-icons/hi';

export default function BrowseJobs() {
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { jobs, total, loading } = useSelector(s => s.jobs);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchJobs({ search, location, articleshipType: type, page, limit: 10 }));
    }, [dispatch, page]);

    const handleSearch = () => {
        setPage(1);
        dispatch(fetchJobs({ search, location, articleshipType: type, page: 1, limit: 10 }));
    };

    // Calculate total pages
    const totalPages = Math.ceil(total / 10) || 1;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Get initials of firm name
    const getInitials = (name) => {
        if (!name) return 'CA';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
        <div className="page-container animate-fade-in bg-gray-50/50 min-h-screen py-10">
            {/* Header section */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 mb-3 border border-violet-100">
                    <HiBriefcase className="w-3.5 h-3.5" /> Opportunities
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Browse <span className="text-primary-600">Articleships</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Find the perfect training opportunity to start your CA articleship journey.</p>
            </div>

            {/* Premium Search & Filter Bar */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                    
                    {/* Search query input */}
                    <div className="flex-1 relative">
                        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200" 
                            placeholder="Search jobs, firms, keywords..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSearch()} 
                        />
                    </div>
                    
                    {/* Location City input */}
                    <div className="relative w-full lg:w-48">
                        <HiLocationMarker className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200" 
                            placeholder="City..." 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    {/* Articleship Type Select */}
                    <div className="relative w-full lg:w-44">
                        <select 
                            className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 cursor-pointer" 
                            value={type} 
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="">All Formats</option>
                            <option value="full-time">Full-time</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="remote">Remote</option>
                        </select>
                        <HiFilter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Search action button */}
                    <button 
                        onClick={handleSearch} 
                        className="px-6 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-250 shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98]"
                    >
                        Search Jobs
                    </button>
                </div>
            </div>

            {/* Results count label */}
            <div className="flex justify-between items-center mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Showing {jobs?.length || 0} of {total || 0} CA Articleships
                </p>
            </div>

            {/* Job listings container */}
            {loading ? (
                <div className="flex justify-center items-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <Link 
                            key={job._id} 
                            to={user?.role === 'student' ? `/student/jobs/${job._id}` : `/jobs/${job._id}`} 
                            className="group block bg-white border border-gray-150 rounded-2xl p-5 hover:border-primary-300 transition-all duration-250 hover:shadow-md hover:shadow-gray-100/70 relative overflow-hidden"
                        >
                            {/* Left highlight strip on hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-250 rounded-l-2xl"></div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    
                                    {/* Firm Avatar Initials */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-indigo-50 text-indigo-700 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors duration-250 flex-shrink-0">
                                        {getInitials(job.firmId?.firmName)}
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-250 text-base">
                                                {job.title}
                                            </h3>
                                            <p className="text-xs font-medium text-gray-500 mt-0.5">
                                                {job.firmId?.firmName || 'CA Firm'}
                                            </p>
                                        </div>

                                        {/* Metadata Chips / Badges */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1.5">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
                                                <HiLocationMarker className="w-3.5 h-3.5 text-gray-400" /> {job.location}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/50 border border-emerald-100/50 rounded-lg px-2.5 py-1">
                                                <HiCurrencyRupee className="w-3.5 h-3.5 text-emerald-600" /> ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50/50 border border-violet-100/50 rounded-lg px-2.5 py-1">
                                                <HiClock className="w-3.5 h-3.5 text-violet-600" /> {job.duration} months
                                            </span>
                                            <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 ${
                                                job.articleshipType === 'remote' 
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                                    : job.articleshipType === 'hybrid' 
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                                        : 'bg-primary-50 text-primary-700 border border-primary-100'
                                            }`}>
                                                {job.articleshipType}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Info (Date & Applicants) */}
                                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
                                    <p className="text-[11px] text-gray-400 font-medium">
                                        Posted: {new Date(job.postedDate || job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <div className="inline-flex items-center gap-1 bg-primary-50/50 border border-primary-100/50 rounded-full px-3 py-1 text-xs font-bold text-primary-700">
                                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                        {job.applicationsCount || 0} applicants
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-150 rounded-2xl text-center py-20 px-4 shadow-sm">
                    <HiBriefcase className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Articleships Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">We couldn't find any opportunities matching your filters. Try adjusting your keywords or format.</p>
                </div>
            )}

            {/* Pagination Controls (Pills layout for large volumes) */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-10">
                    <button 
                        disabled={page <= 1} 
                        onClick={() => setPage(p => p - 1)} 
                        className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                    >
                        <HiChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                                page === pageNum 
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10' 
                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button 
                        disabled={page >= totalPages} 
                        onClick={() => setPage(p => p + 1)} 
                        className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                    >
                        <HiChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
