import { Link } from 'react-router-dom';
import { HiSearch, HiShieldCheck, HiLightningBolt, HiChat, HiStar, HiChartBar, HiCheck, HiArrowRight, HiUserGroup, HiBriefcase, HiAcademicCap } from 'react-icons/hi';

const features = [
    { icon: HiSearch, title: 'Smart Job Matching', desc: 'AI-powered matching connects you with the best-fit articleship opportunities.' },
    { icon: HiShieldCheck, title: 'Verified Firms', desc: 'Every firm is verified by our team ensuring legitimate and quality placements.' },
    { icon: HiLightningBolt, title: 'One-Click Apply', desc: 'Apply to multiple positions instantly with your pre-built profile and resume.' },
    { icon: HiChat, title: 'Direct Communication', desc: 'Connect directly with firms through our built-in messaging system.' },
    { icon: HiStar, title: 'Reviews & Ratings', desc: 'Make informed decisions with authentic reviews from students and firms.' },
    { icon: HiChartBar, title: 'Application Tracking', desc: 'Track your application status in real-time from applied to hired.' },
];

const steps = [
    { num: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, experience, and ICAI details.' },
    { num: '02', title: 'Browse & Match', desc: 'Explore curated opportunities or let our smart matching find the best fit for you.' },
    { num: '03', title: 'Apply & Connect', desc: 'Apply with one click and communicate directly with firms through our platform.' },
    { num: '04', title: 'Get Hired', desc: 'Track your applications, attend interviews, and start your articleship journey.' },
];

const studentPlans = [
    { id: 'free', name: 'Free', price: '0', period: 'forever', features: ['Browse all jobs', '5 applications/month', 'Basic profile', 'Email notifications'], cta: 'Get Started Free' },
    { id: 'premium', name: 'Premium', price: '299', period: '/month', popular: true, features: ['Unlimited applications', 'Priority in search results', 'Profile boost & visibility', 'Application analytics', 'Priority email support', 'Early access to new jobs'], cta: 'Start Premium' },
    { id: 'pro', name: 'Pro', price: '599', period: '/month', features: ['Everything in Premium', 'Featured profile badge', 'Direct firm messaging', 'Resume review by experts', 'Interview prep resources', 'Dedicated support', '1-on-1 career guidance'], cta: 'Start Pro' },
];

const firmPlans = [
    { name: 'Startup', price: '5,000', features: ['5 Job Postings', '50 Student Access', 'Basic Analytics', 'Email Support'] },
    { name: 'Growth', price: '15,000', popular: true, features: ['Unlimited Postings', '500 Student Access', 'Advanced Analytics', 'Priority Support', 'Featured Listings'] },
    { name: 'Enterprise', price: 'Custom', features: ['Everything in Growth', 'Unlimited Access', 'API Integration', 'Dedicated Manager', 'White-label Options', 'Custom Reports'] },
];

export default function LandingPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                            Now connecting 500+ students with top CA firms
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                            Find Your Perfect<br /><span className="text-primary-600">CA Articleship</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                            India's #1 platform connecting Chartered Accountant students with verified CA firms for premium articleship placements.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                            <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2">Start Your Journey <HiArrowRight /></Link>
                            <Link to="/register?role=firm" className="btn-secondary text-base px-8 py-3">Register as Firm</Link>
                        </div>
                        <div className="mt-10 flex justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2 text-gray-600"><HiUserGroup className="w-5 h-5 text-primary-500" /><span><strong className="text-gray-900">500+</strong> Students</span></div>
                            <div className="flex items-center gap-2 text-gray-600"><HiBriefcase className="w-5 h-5 text-primary-500" /><span><strong className="text-gray-900">50+</strong> Firms</span></div>
                            <div className="flex items-center gap-2 text-gray-600"><HiAcademicCap className="w-5 h-5 text-primary-500" /><span><strong className="text-gray-900">200+</strong> Placements</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose <span className="text-primary-600">ArticleConnect</span></h2>
                        <p className="mt-3 text-gray-500">Everything you need to find and secure the perfect CA articleship placement.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="card-hover">
                                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">How It <span className="text-primary-600">Works</span></h2>
                        <p className="mt-3 text-gray-500">Simple steps to your dream articleship</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <div key={i} className="text-center p-6">
                                <div className="text-3xl font-bold text-primary-600 mb-3">{s.num}</div>
                                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-500">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Student Pricing */}
            <section id="student-pricing" className="bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Student <span className="text-primary-600">Plans</span></h2>
                        <p className="mt-3 text-gray-500">Choose the plan that accelerates your articleship search</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {studentPlans.map(p => (
                            <div key={p.id} className={`card relative ${p.popular ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
                                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">MOST POPULAR</div>}
                                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                                <div className="mt-3 mb-5">
                                    <span className="text-3xl font-bold text-gray-900">₹{p.price}</span>
                                    <span className="text-gray-500 text-sm">{p.period}</span>
                                </div>
                                <ul className="space-y-2.5 mb-6">
                                    {p.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <HiCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />{f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register" className={`block text-center py-2.5 rounded-lg font-medium text-sm ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>{p.cta}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Firm Pricing */}
            <section id="firm-pricing" className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Firm <span className="text-primary-600">Pricing Plans</span></h2>
                        <p className="mt-3 text-gray-500">Choose the plan that fits your hiring needs</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {firmPlans.map((p, i) => (
                            <div key={i} className={`card relative ${p.popular ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
                                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">MOST POPULAR</div>}
                                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                                <div className="mt-3 mb-5">
                                    <span className="text-3xl font-bold text-gray-900">₹{p.price}</span>
                                    {p.price !== 'Custom' && <span className="text-gray-500 text-sm">/month</span>}
                                </div>
                                <ul className="space-y-2.5 mb-6">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                            <HiCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />{f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register?role=firm" className={`block text-center py-2.5 rounded-lg font-medium text-sm ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>Get Started</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl font-bold text-white">Ready to Start Your CA Journey?</h2>
                    <p className="mt-3 text-primary-100 text-lg">Join thousands of CA students and firms already using ArticleConnect.</p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                        <Link to="/register" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">Create Free Account</Link>
                        <Link to="/register?role=firm" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">Register Your Firm</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
