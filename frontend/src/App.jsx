import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import StudentDashboard from './pages/student/Dashboard';
import BrowseJobs from './pages/student/BrowseJobs';
import JobDetail from './pages/student/JobDetail';
import MyApplications from './pages/student/MyApplications';
import StudentProfile from './pages/student/Profile';
import StudentPremium from './pages/student/Premium';
import FirmDashboard from './pages/firm/Dashboard';
import PostJob from './pages/firm/PostJob';
import ManageJobs from './pages/firm/ManageJobs';
import Candidates from './pages/firm/Candidates';
import FirmProfile from './pages/firm/Profile';
import Billing from './pages/firm/Billing';
import AdminDashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/Users';
import FirmApprovals from './pages/admin/Approvals';
import AdminAnalytics from './pages/admin/Analytics';
import AdminPostJob from './pages/admin/PostJob';
import AdminManageJobs from './pages/admin/ManageJobs';

function ProtectedRoute({ children, roles }) {
    const { user } = useSelector((state) => state.auth);
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
}

export default function App() {
    const { user } = useSelector((state) => state.auth);

    const getDashboardRoute = () => {
        if (!user) return '/login';
        if (user.role === 'student') return '/student/dashboard';
        if (user.role === 'firm') return '/firm/dashboard';
        if (user.role === 'admin') return '/admin/dashboard';
        return '/';
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={user ? <Navigate to={getDashboardRoute()} /> : <LandingPage />} />
                    <Route path="/jobs" element={<BrowseJobs />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/login" element={user ? <Navigate to={getDashboardRoute()} /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to={getDashboardRoute()} /> : <Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/student/jobs" element={<ProtectedRoute roles={['student']}><BrowseJobs /></ProtectedRoute>} />
                    <Route path="/student/jobs/:id" element={<ProtectedRoute roles={['student']}><JobDetail /></ProtectedRoute>} />
                    <Route path="/student/applications" element={<ProtectedRoute roles={['student']}><MyApplications /></ProtectedRoute>} />
                    <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>} />
                    <Route path="/student/premium" element={<ProtectedRoute roles={['student']}><StudentPremium /></ProtectedRoute>} />

                    {/* Firm Routes */}
                    <Route path="/firm/dashboard" element={<ProtectedRoute roles={['firm']}><FirmDashboard /></ProtectedRoute>} />
                    <Route path="/firm/post-job" element={<ProtectedRoute roles={['firm']}><PostJob /></ProtectedRoute>} />
                    <Route path="/firm/manage-jobs" element={<ProtectedRoute roles={['firm']}><ManageJobs /></ProtectedRoute>} />
                    <Route path="/firm/candidates" element={<ProtectedRoute roles={['firm']}><Candidates /></ProtectedRoute>} />
                    <Route path="/firm/profile" element={<ProtectedRoute roles={['firm']}><FirmProfile /></ProtectedRoute>} />
                    <Route path="/firm/billing" element={<ProtectedRoute roles={['firm']}><Billing /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/post-job" element={<ProtectedRoute roles={['admin']}><AdminPostJob /></ProtectedRoute>} />
                    <Route path="/admin/manage-jobs" element={<ProtectedRoute roles={['admin']}><AdminManageJobs /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UsersManagement /></ProtectedRoute>} />
                    <Route path="/admin/approvals" element={<ProtectedRoute roles={['admin']}><FirmApprovals /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
