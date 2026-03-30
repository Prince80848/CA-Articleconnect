import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchNotifications, markAsRead, markAllAsRead } from '../redux/slices/notificationSlice';
import { HiBell, HiMenu, HiX, HiChevronDown, HiLogout, HiUser, HiCheckCircle } from 'react-icons/hi';
import { useEffect } from 'react';

const navLinks = {
    student: [
        { to: '/student/dashboard', label: 'Home' },
        { to: '/student/jobs', label: 'Browse Jobs' },
        { to: '/student/applications', label: 'Applications' },
        { to: '/student/profile', label: 'Profile' },
        { to: '/student/premium', label: 'Premium', highlight: true },
    ],
    firm: [
        { to: '/firm/dashboard', label: 'Home' },
        { to: '/firm/post-job', label: 'Post Job' },
        { to: '/firm/manage-jobs', label: 'Manage Jobs' },
        { to: '/firm/candidates', label: 'Candidates' },
        { to: '/firm/billing', label: 'Billing' },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Home' },
        { to: '/admin/post-job', label: 'Post Job', highlight: true },
        { to: '/admin/manage-jobs', label: 'Jobs' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/approvals', label: 'Approvals' },
        { to: '/admin/analytics', label: 'Analytics' },
    ],
};

export default function Navbar() {
    const { user } = useSelector(s => s.auth);
    const { items: notifications, unreadCount } = useSelector(s => s.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    useEffect(() => {
        if (user) dispatch(fetchNotifications());
    }, [user, dispatch]);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) dispatch(markAsRead(notification._id));
        setNotifOpen(false);
        if (notification.link) navigate(notification.link);
    };

    const links = user ? navLinks[user.role] || [] : [];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setDropOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CA</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">ArticleConnect</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {!user && (
                            <>
                                <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                    Home
                                </Link>
                                <Link to="/jobs" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith('/jobs') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                    Browse Jobs
                                </Link>
                            </>
                        )}
                        {links.map(link => (
                            <Link key={link.to} to={link.to}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${link.highlight
                                        ? 'text-primary-600 hover:bg-primary-50'
                                        : location.pathname === link.to
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="relative">
                                    <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                        <HiBell className="w-5 h-5" />
                                        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                                    </button>

                                    {notifOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                                            <div className="absolute -right-20 sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-80 sm:max-w-none max-h-[80vh] sm:max-h-96 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-modal z-20 py-2">
                                                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <button onClick={() => dispatch(markAllAsRead())} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Mark all read</button>
                                                    )}
                                                </div>
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-center text-sm text-gray-500">No notifications yet</div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n._id} onClick={() => handleNotificationClick(n)}
                                                            className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                                                            <div className="flex gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                    {n.type === 'new_job' ? <HiBell className="w-4 h-4"/> : <HiCheckCircle className="w-4 h-4" />}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>{n.title}</p>
                                                                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="relative">
                                    <button onClick={() => setDropOpen(!dropOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                                        <HiChevronDown className="w-4 h-4 text-gray-400" />
                                    </button>

                                    {dropOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-modal z-20 py-1">
                                                <div className="px-4 py-2 border-b border-gray-100 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate" title={user.name}>{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate" title={user.email}>{user.email}</p>
                                                </div>
                                                <Link to={`/${user.role}/profile`} onClick={() => setDropOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                    <HiUser className="w-4 h-4" /> Profile
                                                </Link>
                                                <button onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                    <HiLogout className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">Login</Link>
                                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Get Started</Link>
                            </div>
                        )}

                        {/* Mobile Toggle */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                            {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {!user && (
                            <>
                                <Link to="/" onClick={() => setMobileOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}>
                                    Home
                                </Link>
                                <Link to="/jobs" onClick={() => setMobileOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname.startsWith('/jobs') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}>
                                    Browse Jobs
                                </Link>
                            </>
                        )}
                        {links.map(link => (
                            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === link.to ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
