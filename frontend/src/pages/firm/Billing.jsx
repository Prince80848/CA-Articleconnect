import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCheck, HiCreditCard, HiCheckCircle, HiChip, HiLightningBolt, HiOfficeBuilding } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const plans = [
    {
        id: 'startup',
        name: 'Startup',
        price: 5000,
        priceDisplay: '5,000',
        color: 'border-gray-200',
        badgeColor: 'bg-gray-100 text-gray-600',
        icon: HiOfficeBuilding,
        features: ['5 Job Postings/month', '50 Student Profiles Access', 'Basic Dashboard', 'Email Support']
    },
    {
        id: 'growth',
        name: 'Growth',
        price: 15000,
        priceDisplay: '15,000',
        popular: true,
        color: 'border-primary-500',
        badgeColor: 'bg-primary-100 text-primary-700',
        icon: HiLightningBolt,
        features: ['Unlimited Job Postings', '500 Student Profiles', 'Advanced Analytics', 'Priority Support', 'Featured Listings']
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 50000,
        priceDisplay: '50,000',
        color: 'border-purple-300',
        badgeColor: 'bg-purple-100 text-purple-700',
        icon: HiChip,
        features: ['Everything in Growth', 'Unlimited Student Access', 'API Integration', 'Dedicated Account Manager', 'Custom Branding']
    },
];

const PLAN_LABELS = { startup: 'Startup', growth: 'Growth', enterprise: 'Enterprise' };

export default function Billing() {
    const [subscription, setSubscription] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingPlan, setPayingPlan] = useState(null);
    const [step, setStep] = useState('idle'); // idle | processing | verifying | success

    const fetchData = () =>
        Promise.all([
            api.get('/subscriptions/me').then(r => setSubscription(r.data.data)).catch(() => {}),
            api.get('/payments/history').then(r => setPayments(r.data.data?.payments || [])).catch(() => {})
        ]).finally(() => setLoading(false));

    useEffect(() => { fetchData(); }, []);

    const handleSubscribe = async (plan) => {
        setPayingPlan(plan.id);
        setStep('processing');
        try {
            // Step 1: Create a real Razorpay order on the backend
            toast.loading('Creating payment order...', { id: 'pay' });
            const orderRes = await api.post('/payments/create', {
                amount: plan.price,
                type: 'subscription',
                description: `${plan.name} Plan Subscription – 30 days`
            });
            const { razorpayOrderId, keyId } = orderRes.data.data;

            // Step 2: Open Razorpay checkout popup
            toast.dismiss('pay');
            const paymentResult = await new Promise((resolve, reject) => {
                const options = {
                    key: keyId,
                    amount: plan.price * 100,
                    currency: 'INR',
                    name: 'ArticleConnect',
                    description: `${plan.name} Plan Subscription – 30 days`,
                    order_id: razorpayOrderId,
                    handler: function (response) {
                        resolve(response);
                    },
                    prefill: {
                        name: '',
                        email: '',
                        contact: ''
                    },
                    theme: {
                        color: '#6366f1'
                    },
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

            // Step 3: Verify payment on backend
            setStep('verifying');
            toast.loading('Verifying payment...', { id: 'pay' });
            const verifyRes = await api.post('/payments/verify', {
                razorpayOrderId: paymentResult.razorpay_order_id,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature
            });

            // Step 4: Activate subscription
            toast.loading('Activating subscription...', { id: 'pay' });
            await api.post('/subscriptions', {
                plan: plan.id,
                paymentId: verifyRes.data.data._id
            });

            toast.success(`🎉 Successfully subscribed to ${plan.name}!`, { id: 'pay', duration: 4000 });
            setStep('success');
            await fetchData();
        } catch (err) {
            const msg = err.message || err.response?.data?.message || 'Payment failed. Please try again.';
            if (msg !== 'Payment cancelled by user') {
                toast.error(msg, { id: 'pay' });
            } else {
                toast.dismiss('pay');
                toast('Payment cancelled', { id: 'pay', icon: '🚫' });
            }
            setStep('idle');
        } finally {
            setPayingPlan(null);
        }
    };

    if (loading) return (
        <div className="page-container flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="page-container animate-fade-in">
            <div className="mb-8">
                <h1 className="section-title mb-1">Billing & <span className="text-primary-600">Subscriptions</span></h1>
                <p className="section-subtitle">Purchase a plan to start posting jobs and accessing candidates</p>
            </div>

            {/* SUCCESS BANNER */}
            {step === 'success' && (
                <div className="card mb-6 bg-green-50 border-green-200 flex items-center gap-3">
                    <HiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-green-800">Payment Successful!</p>
                        <p className="text-sm text-green-700">Your subscription is now active. You can <Link to="/firm/post-job" className="underline font-medium">post jobs now</Link>.</p>
                    </div>
                </div>
            )}

            {/* CURRENT PLAN BANNER */}
            {subscription && (
                <div className="card mb-8 border-primary-200 bg-primary-50/30">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Current Plan</p>
                            <p className="text-2xl font-bold text-gray-900 capitalize">{PLAN_LABELS[subscription.plan] || subscription.plan}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Valid until: <span className="font-medium text-gray-700">{new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="badge-success">Active</span>
                            <p className="text-xs text-gray-400 mt-2">Auto-renew enabled</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {plans.map(p => {
                    const isCurrentPlan = subscription?.plan === p.id;
                    const isProcessing = payingPlan === p.id;
                    const Icon = p.icon;
                    return (
                        <div key={p.id} className={`card relative flex flex-col ${p.popular ? `ring-2 ring-primary-500 ${p.color}` : p.color} ${isCurrentPlan ? 'bg-primary-50/20' : ''}`}>
                            {p.popular && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.badgeColor}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                ₹{p.priceDisplay}
                                <span className="text-gray-400 text-sm font-normal">/month</span>
                            </p>
                            <ul className="space-y-2.5 my-5 flex-1">
                                {p.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                        <HiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => !isCurrentPlan && handleSubscribe(p)}
                                disabled={isCurrentPlan || isProcessing || (payingPlan && payingPlan !== p.id)}
                                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                                    isCurrentPlan
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : p.popular
                                            ? 'btn-primary'
                                            : 'btn-secondary'
                                }`}
                            >
                                {isProcessing ? (
                                    <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Processing...</>
                                ) : isCurrentPlan ? (
                                    <><HiCheckCircle className="w-4 h-4" /> Current Plan</>
                                ) : (
                                    <><HiCreditCard className="w-4 h-4" /> Subscribe Now</>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* PAYMENT HISTORY */}
            <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <HiCreditCard className="w-4 h-4 text-primary-600" />
                    Payment History
                </h3>
                {payments.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Date</th><th>Invoice</th><th>Description</th><th>Amount</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p._id}>
                                        <td className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="text-sm font-mono text-gray-500">{p.invoiceNumber || '—'}</td>
                                        <td className="text-sm">{p.description || p.type}</td>
                                        <td className="text-sm font-semibold text-gray-900">₹{p.amount?.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`badge ${p.status === 'successful' ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <HiCreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No payments yet. Subscribe to a plan above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
