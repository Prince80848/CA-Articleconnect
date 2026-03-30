import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try { await api.post('/auth/forgot-password', { email }); setSent(true); toast.success('Reset link sent!'); }
        catch (err) { toast.error('Failed to send reset link'); }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{sent ? 'Check Your Email' : 'Reset Password'}</h1>
                    <p className="text-gray-500 mt-1">{sent ? 'We\'ve sent a password reset link to your email' : 'Enter your email to receive a reset link'}</p>
                </div>
                {sent ? (
                    <div className="card text-center">
                        <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4"><HiMail className="w-7 h-7 text-primary-600" /></div>
                        <p className="text-gray-600 text-sm mb-6">If an account exists with <strong>{email}</strong>, you'll receive a password reset link shortly.</p>
                        <Link to="/login" className="text-primary-600 font-medium text-sm hover:text-primary-700 flex items-center justify-center gap-1"><HiArrowLeft className="w-4 h-4" /> Back to login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="card space-y-5">
                        <div>
                            <label className="label-text">Email Address</label>
                            <div className="relative">
                                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" className="input-field pl-10" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
                        <p className="text-center text-sm"><Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-1"><HiArrowLeft className="w-4 h-4" /> Back to login</Link></p>
                    </form>
                )}
            </div>
        </div>
    );
}
