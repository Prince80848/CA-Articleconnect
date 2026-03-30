import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleAuth } from '../../redux/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(s => s.auth);
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login(form));
        if (login.fulfilled.match(result)) {
            const role = result.payload.user.role;
            toast.success('Welcome back!');
            navigate(role === 'admin' ? '/admin/dashboard' : role === 'firm' ? '/firm/dashboard' : '/student/dashboard');
        } else toast.error(result.payload || 'Login failed');
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await dispatch(googleAuth({ idToken: credentialResponse.credential, role: 'student' }));
        if (googleAuth.fulfilled.match(result)) {
            const role = result.payload.user.role;
            toast.success('Google Login successful!');
            navigate(role === 'admin' ? '/admin/dashboard' : role === 'firm' ? '/firm/dashboard' : '/student/dashboard');
        } else toast.error(result.payload || 'Google Login failed');
    };

    const handleGoogleError = () => {
        toast.error('Google Login Failed');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-1">Sign in to your ArticleConnect account</p>
                </div>
                <form onSubmit={handleSubmit} className="card space-y-5">
                    <div>
                        <label className="label-text">Email Address</label>
                        <div className="relative">
                            <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" className="input-field pl-10" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="label-text">Password</label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="••••••••" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600"><input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> Remember me</label>
                        <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">Forgot Password?</Link>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
                    
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            theme="outline"
                            size="large"
                            className="w-full flex justify-center"
                        />
                    </div>

                    <p className="text-center text-sm text-gray-500">Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">Create one</Link></p>
                </form>
            </div>
        </div>
    );
}
