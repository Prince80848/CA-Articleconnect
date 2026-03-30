import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, googleAuth } from '../../redux/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(s => s.auth);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'student', firmName: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        const result = await dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, firmName: form.firmName }));
        if (registerUser.fulfilled.match(result)) {
            toast.success('Account created!');
            navigate(form.role === 'firm' ? '/firm/dashboard' : '/student/dashboard');
        } else toast.error(result.payload || 'Registration failed');
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await dispatch(googleAuth({ idToken: credentialResponse.credential, role: form.role, firmName: form.role === 'firm' ? form.firmName : undefined }));
        if (googleAuth.fulfilled.match(result)) {
            const role = result.payload.user.role;
            toast.success('Google Signup successful!');
            navigate(role === 'admin' ? '/admin/dashboard' : role === 'firm' ? '/firm/dashboard' : '/student/dashboard');
        } else toast.error(result.payload || 'Google Signup failed');
    };

    const handleGoogleError = () => {
        toast.error('Google Signup Failed');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-1">Join ArticleConnect and start your journey</p>
                </div>
                <form onSubmit={handleSubmit} className="card space-y-5">
                    {/* Role Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                        <button type="button" onClick={() => setForm({ ...form, role: 'student' })} className={`py-2.5 text-sm font-medium rounded-md transition-all ${form.role === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <HiUser className="inline w-4 h-4 mr-1" /> Student
                        </button>
                        <button type="button" onClick={() => setForm({ ...form, role: 'firm' })} className={`py-2.5 text-sm font-medium rounded-md transition-all ${form.role === 'firm' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <HiOfficeBuilding className="inline w-4 h-4 mr-1" /> CA Firm
                        </button>
                    </div>

                    {form.role === 'firm' && (
                        <div><label className="label-text">Firm Name</label>
                            <div className="relative"><HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input className="input-field pl-10" placeholder="Your firm name" required value={form.firmName} onChange={e => setForm({ ...form, firmName: e.target.value })} /></div></div>
                    )}

                    <div><label className="label-text">Full Name</label>
                        <div className="relative"><HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input className="input-field pl-10" placeholder="Your full name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div></div>

                    <div><label className="label-text">Email Address</label>
                        <div className="relative"><HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" className="input-field pl-10" placeholder="you@example.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div></div>

                    <div><label className="label-text">Phone Number</label>
                        <div className="relative"><HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input className="input-field pl-10" placeholder="+91 XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div></div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="label-text">Password</label>
                            <div className="relative"><HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="password" className="input-field pl-10" placeholder="••••••" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div></div>
                        <div><label className="label-text">Confirm Password</label>
                            <div className="relative"><HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="password" className="input-field pl-10" placeholder="••••••" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} /></div></div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : `Register as ${form.role === 'firm' ? 'CA Firm' : 'Student'}`}</button>
                    
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

                    <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link></p>
                </form>
            </div>
        </div>
    );
}
