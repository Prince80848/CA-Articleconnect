import { Link } from 'react-router-dom';
import { HiCheck, HiStar, HiLightningBolt, HiShieldCheck, HiChat, HiDocumentText, HiAcademicCap, HiChartBar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const plans = [
    {
        id: 'free', name: 'Free', price: '0', period: 'forever', icon: HiAcademicCap, color: 'text-gray-600 bg-gray-50',
        features: ['Browse all jobs', '5 applications per month', 'Basic profile', 'Email notifications'],
        cta: 'Current Plan', disabled: true
    },
    {
        id: 'premium', name: 'Premium', price: '299', period: '/month', icon: HiStar, color: 'text-primary-600 bg-primary-50', popular: true,
        features: ['Unlimited applications', 'Priority in search results', 'Profile boost & higher visibility', 'Application analytics dashboard', 'Priority email support', 'Early access to new job postings', 'Application status insights'],
        cta: 'Upgrade to Premium'
    },
    {
        id: 'pro', name: 'Pro', price: '599', period: '/month', icon: HiLightningBolt, color: 'text-amber-600 bg-amber-50',
        features: ['Everything in Premium', 'Featured profile badge ⭐', 'Direct messaging with firms', 'Resume review by CA experts', 'Interview preparation resources', 'Dedicated career support', '1-on-1 career guidance sessions', 'Priority application processing'],
        cta: 'Upgrade to Pro'
    },
];

const benefits = [
    { icon: HiChartBar, title: 'Application Analytics', desc: 'Track how firms view your applications, see who shortlisted you, and understand your success rate.' },
    { icon: HiShieldCheck, title: 'Profile Boost', desc: 'Your profile appears higher in search results. Firms are 3x more likely to view boosted profiles.' },
    { icon: HiChat, title: 'Direct Messaging', desc: 'Skip the formal application process. Message hiring partners directly and make a personal connection.' },
    { icon: HiDocumentText, title: 'Resume Review', desc: 'Get your resume reviewed by experienced Chartered Accountants. Stand out from other applicants.' },
];

import { useState } from 'react';

const PLAN_PRICES = { premium: 299, pro: 599 };

export default function Premium() {
    const [upgrading, setUpgrading] = useState(null);

    const handleUpgrade = async (planId) => {
        if (planId === 'free') return;
        setUpgrading(planId);
        try {
            const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
            const price = PLAN_PRICES[planId];

            // Step 1: Create a real Razorpay order
            toast.loading('Creating payment order...', { id: 'upgrade' });
            const orderRes = await api.post('/payments/create', {
                amount: price,
                type: 'student_subscription',
                description: `Student ${planName} Plan – 30 days`
            });
            const { razorpayOrderId, keyId } = orderRes.data.data;

            // Step 2: Open Razorpay checkout popup
            toast.dismiss('upgrade');
            const paymentResult = await new Promise((resolve, reject) => {
                const options = {
                    key: keyId,
                    amount: price * 100,
                    currency: 'INR',
                    name: 'ArticleConnect',
                    description: `Student ${planName} Plan – 30 days`,
                    order_id: razorpayOrderId,
                    handler: function (response) {
                        resolve(response);
                    },
                    theme: { color: '#6366f1' },
                    modal: {
                        ondismiss: function () {
                            reject(new Error('Payment cancelled by user'));
                        }
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    reject(new Error(response.error?.description || 'Payment failed'));
                });
                rzp.open();
            });

            // Step 3: Verify payment
            toast.loading('Verifying payment...', { id: 'upgrade' });
            await api.post('/payments/verify', {
                razorpayOrderId: paymentResult.razorpay_order_id,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature
            });

            // Step 4: Activate student premium
            toast.loading('Activating plan...', { id: 'upgrade' });
            await api.post('/students/upgrade', { plan: planId });

            toast.success(`🎉 Upgraded to ${planName} successfully!`, { id: 'upgrade', duration: 4000 });
        } catch (err) {
            const msg = err.message || err.response?.data?.message || 'Upgrade failed';
            if (msg !== 'Payment cancelled by user') {
                toast.error(msg, { id: 'upgrade' });
            } else {
                toast.dismiss('upgrade');
                toast('Payment cancelled', { id: 'upgrade', icon: '🚫' });
            }
        } finally {
            setUpgrading(null);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold">Accelerate Your <span className="text-primary-200">Articleship Search</span></h1>
                    <p className="mt-3 text-primary-100 text-lg max-w-2xl mx-auto">Premium members get 3x more interviews and are hired 40% faster. Invest in your CA career.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 mb-16">
                    {plans.map(p => (
                        <div key={p.id} className={`card relative ${p.popular ? 'border-primary-500 ring-2 ring-primary-500' : ''}`}>
                            {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">RECOMMENDED</div>}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-lg ${p.color} flex items-center justify-center`}><p.icon className="w-5 h-5" /></div>
                                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">₹{p.price}</span>
                                <span className="text-gray-500 text-sm">{p.period}</span>
                            </div>
                            <ul className="space-y-2.5 mb-6">
                                {p.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <HiCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />{f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => !p.disabled && handleUpgrade(p.id)} disabled={p.disabled || upgrading === p.id || (upgrading && upgrading !== p.id)}
                                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${p.disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                                {upgrading === p.id ? (<><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Processing...</>) : p.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Go <span className="text-primary-600">Premium?</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="card-hover flex gap-4">
                                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0"><b.icon className="w-5 h-5 text-primary-600" /></div>
                                <div><h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3><p className="text-sm text-gray-500">{b.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            ['Can I cancel anytime?', 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.'],
                            ['Is the payment secure?', 'Absolutely. We use Razorpay for payment processing with bank-level encryption. Your financial data is never stored on our servers.'],
                            ['Will firms know I\'m a premium member?', 'Premium members get a subtle badge on their profile. Pro members get a featured badge that firms can easily spot.'],
                            ['What if I get placed before my plan expires?', 'Congratulations! You can cancel your plan anytime. We don\'t charge cancellation fees.'],
                        ].map(([q, a], i) => (
                            <div key={i} className="card">
                                <h4 className="font-semibold text-gray-900 mb-1">{q}</h4>
                                <p className="text-sm text-gray-500">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
