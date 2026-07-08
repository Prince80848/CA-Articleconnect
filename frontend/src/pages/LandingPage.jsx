import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiShieldCheck, HiLightningBolt, HiChat, HiStar, HiChartBar, HiCheck, HiArrowRight, HiUserGroup, HiBriefcase, HiAcademicCap, HiSparkles, HiTrendingUp, HiGlobe } from 'react-icons/hi';

const features = [
    { icon: HiSearch, title: 'Smart Job Matching', desc: 'AI-powered matching connects you with the best-fit articleship opportunities instantly.', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50/50' },
    { icon: HiShieldCheck, title: 'Verified Firms', desc: 'Every firm is verified by our team ensuring legitimate and quality placements.', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50/50' },
    { icon: HiLightningBolt, title: 'One-Click Apply', desc: 'Apply to multiple positions instantly with your pre-built profile and resume.', color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50/50' },
    { icon: HiChat, title: 'Direct Communication', desc: 'Connect directly with firms through our built-in messaging system.', color: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50/50' },
    { icon: HiStar, title: 'Reviews & Ratings', desc: 'Make informed decisions with authentic reviews from students and firms.', color: 'from-pink-500 to-rose-600', bgLight: 'bg-pink-50/50' },
    { icon: HiChartBar, title: 'Application Tracking', desc: 'Track your application status in real-time from applied to hired.', color: 'from-indigo-500 to-violet-600', bgLight: 'bg-indigo-50/50' },
];

const steps = [
    { num: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, experience, and ICAI details.', icon: HiUserGroup },
    { num: '02', title: 'Browse & Match', desc: 'Explore curated opportunities or let our smart matching find the best fit for you.', icon: HiSearch },
    { num: '03', title: 'Apply & Connect', desc: 'Apply with one click and communicate directly with firms through our platform.', icon: HiLightningBolt },
    { num: '04', title: 'Get Hired', desc: 'Track your applications, attend interviews, and start your articleship journey.', icon: HiAcademicCap },
];

const studentPlans = [
    { id: 'free', name: 'Free', price: '0', period: 'forever', features: ['Browse all jobs', '5 applications/month', 'Basic profile', 'Email notifications'], cta: 'Get Started Free' },
    { id: 'premium', name: 'Premium', price: '159', period: '/month', popular: true, features: ['Unlimited applications', 'Priority in search results', 'Profile boost & visibility', 'Application analytics', 'Priority email support', 'Early access to new jobs'], cta: 'Start Premium' },
    { id: 'pro', name: 'Pro', price: '299', period: '/month', features: ['Everything in Premium', 'Featured profile badge', 'Direct firm messaging', 'Resume review by experts', 'Interview prep resources', 'Dedicated support', '1-on-1 career guidance'], cta: 'Start Pro' },
];

const firmPlans = [
    { name: 'Startup', price: '499', features: ['5 Job Postings', '50 Student Access', 'Basic Analytics', 'Email Support'] },
    { name: 'Growth', price: '999', popular: true, features: ['Unlimited Postings', '500 Student Access', 'Advanced Analytics', 'Priority Support', 'Featured Listings'] }
];

const testimonials = [
    { name: 'Arjun Sharma', role: 'CA Final Student', text: 'CAHire helped me land my articleship at a Big 4 firm within 2 weeks. The process was seamless!', avatar: 'AS', color: 'from-violet-400 to-purple-600' },
    { name: 'Priya Mehta', role: 'CA Inter Student', text: "The premium plan's profile boost got me 3x more interview calls. Best investment for my CA journey.", avatar: 'PM', color: 'from-pink-400 to-rose-600' },
    { name: 'Ravi Kumar', role: 'HR Manager, S&R Associates', text: 'We found 5 exceptional articleship candidates in a single week. CAHire is our go-to hiring platform.', avatar: 'RK', color: 'from-emerald-400 to-teal-600' },
];

const typewriterWords = [
    'Statutory Audit',
    'Direct Taxation',
    'Indirect Tax (GST)',
    'Internal Audit',
    'Financial Advisory',
    'Transfer Pricing',
    'Corporate Law'
];

export default function LandingPage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentText, setCurrentText] = useState('');

    // Typewriter effect
    useEffect(() => {
        if (subIndex === typewriterWords[wordIndex].length + 1 && !isDeleting) {
            // Wait before starting deletion
            const timeout = setTimeout(() => setIsDeleting(true), 1500);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && isDeleting) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % typewriterWords.length);
            return;
        }

        const delay = isDeleting ? 60 : 120;
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
        }, delay);

        return () => clearTimeout(timeout);
    }, [subIndex, isDeleting, wordIndex]);

    useEffect(() => {
        setCurrentText(typewriterWords[wordIndex].substring(0, subIndex));
    }, [subIndex, wordIndex]);

    return (
        <div className="animate-fade-in overflow-hidden bg-white text-gray-800">

            {/* HERO SECTION (TWO COLUMN - LIGHT & PREMIUM) */}
            <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-gradient-to-tr from-violet-50/40 via-white to-blue-50/20 border-b border-gray-100 py-12 lg:py-0">
                {/* Background decorative patterns */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] rounded-full opacity-35 blur-3xl" style={{ background: 'radial-gradient(circle, #ddd6fe, transparent)', top: '-10%', left: '-5%' }} />
                    <div className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #bae6fd, transparent)', bottom: '5%', right: '-5%' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* LEFT COLUMN: TEXT CONTENT */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            {/* Soft Brand Badge */}
                            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-semibold bg-primary-50 border border-primary-100/50 text-primary-700">
                                <HiSparkles className="w-3.5 h-3.5 text-primary-500" />
                                Connecting 500+ students with top CA firms
                            </div>

                            {/* Headline with Typewriter */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
                                Find Your Perfect<br />
                                <span className="block mt-2">CA Articleship in</span>
                                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 min-h-[1.2em] relative">
                                    {currentText}
                                    <span className="inline-block w-1 h-[0.85em] bg-indigo-600 ml-1 animate-pulse absolute bottom-1"></span>
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
                                India's #1 platform connecting Chartered Accountant students with verified CA firms for premium articleship placements. Get hired by top firms in your preferred domains.
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link to="/register" className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5">
                                    Start Your Journey
                                    <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/register?role=firm" className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-gray-700 text-xs sm:text-sm bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 shadow-sm">
                                    Register as Firm
                                </Link>
                            </div>

                            {/* Sleek Stats */}
                            <div className="grid grid-cols-3 gap-3 max-w-md pt-4">
                                {[
                                    { icon: HiUserGroup, value: '500+', label: 'Students', color: 'text-violet-600 bg-violet-50' },
                                    { icon: HiBriefcase, value: '50+', label: 'Firms', color: 'text-indigo-600 bg-indigo-50' },
                                    { icon: HiAcademicCap, value: '200+', label: 'Placements', color: 'text-blue-600 bg-blue-50' },
                                ].map((s, i) => (
                                    <div key={i} className="flex flex-col items-start p-3 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm">
                                        <div className={`p-1 rounded-lg mb-1.5 ${s.color}`}>
                                            <s.icon className="w-4 h-4" />
                                        </div>
                                        <div className="text-lg font-extrabold text-gray-900">{s.value}</div>
                                        <div className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: HERO IMAGE (BLENDED & FLOATING) */}
                        <div className="lg:col-span-5 flex justify-center items-center">
                            <div className="relative w-full max-w-[420px] lg:max-w-none animate-float">
                                {/* Decorative soft gradient glow back drop */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-violet-200/40 to-blue-200/30 rounded-full blur-2xl"></div>
                                <img 
                                    src="/ca_hero.png" 
                                    alt="CAHire Placements Illustration" 
                                    className="relative w-full h-auto object-contain select-none filter drop-shadow-md mix-blend-multiply"
                                    draggable="false"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TRUST BAR (WHITE background, clean spacing) */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Trusted by students at leading ICAI chapters</p>
                    <div className="flex flex-wrap justify-center gap-10 items-center">
                        {['ICAI Delhi', 'ICAI Mumbai', 'ICAI Bangalore', 'ICAI Chennai', 'ICAI Hyderabad'].map((name, i) => (
                            <span key={i} className="text-gray-400 font-extrabold text-sm tracking-wider hover:text-gray-500 transition-colors">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold mb-4">
                            <HiSparkles className="w-3.5 h-3.5 text-violet-500" /> Why CAHire?
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Everything You Need to Launch Your Career
                        </h2>
                        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-xl mx-auto">Everything you need to find and secure the perfect CA articleship placement.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.color} text-white`}>
                                    <f.icon className="w-5.5 h-5.5" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4">
                            <HiTrendingUp className="w-3.5 h-3.5 text-blue-500" /> Simple Process
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            How It Works
                        </h2>
                        <p className="mt-3 text-gray-500 text-sm sm:text-base">Four simple steps to your dream articleship</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="relative z-10 w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-white border border-gray-100 group-hover:border-primary-200 shadow-sm group-hover:scale-105 transition-all duration-300">
                                    <s.icon className="w-8 h-8 text-primary-600" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-[10px] font-bold text-white">{s.num}</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-base mb-1.5">{s.title}</h3>
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-2">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold mb-4">
                            <HiStar className="w-3.5 h-3.5 text-pink-500" /> Success Stories
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            What Our Users Say
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 shadow-sm transition-all duration-300">
                                <div className="flex items-center gap-0.5 mb-4">
                                    {[...Array(5)].map((_, j) => <HiStar key={j} className="w-4 h-4 text-amber-400" />)}
                                </div>
                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-xs sm:text-sm">{t.name}</p>
                                        <p className="text-gray-400 text-[10px] sm:text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STUDENT PLANS */}
            <section id="student-pricing" className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold mb-4">
                            <HiUserGroup className="w-3.5 h-3.5 text-violet-500" /> For Students
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Student Plans
                        </h2>
                        <p className="mt-3 text-gray-500 text-sm sm:text-base">Choose the plan that accelerates your articleship search</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                        {studentPlans.map(p => (
                            <div key={p.id} className={`relative rounded-2xl p-8 bg-white border border-gray-100 transition-all duration-300 hover:border-primary-200 hover:shadow-xl`}>
                                {p.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold text-primary-700 bg-primary-50 border border-primary-100/50 shadow-sm whitespace-nowrap">
                                        ⭐ MOST POPULAR
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
                                <div className="mt-3 mb-6">
                                    <span className="text-3xl font-extrabold text-gray-900">₹{p.price}</span>
                                    <span className="text-xs text-gray-400 ml-1">{p.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {p.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm">
                                            <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-50">
                                                <HiCheck className="w-3 h-3 text-primary-600" />
                                            </div>
                                            <span className="text-gray-600">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register" className={`block text-center py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${p.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    {p.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FIRM PLANS */}
            <section id="firm-pricing" className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4">
                            <HiBriefcase className="w-3.5 h-3.5 text-emerald-500" /> For Firms
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Firm Pricing Plans
                        </h2>
                        <p className="mt-3 text-gray-500 text-sm sm:text-base">Choose the plan that fits your hiring needs</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-start">
                        {firmPlans.map((p, i) => (
                            <div key={i} className={`relative rounded-2xl p-8 bg-white border border-gray-100 transition-all duration-300 hover:border-emerald-200 hover:shadow-xl`}>
                                {p.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/50 shadow-sm whitespace-nowrap">
                                        ⭐ MOST POPULAR
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
                                <div className="mt-3 mb-6">
                                    <span className="text-3xl font-extrabold text-gray-900">₹{p.price}</span>
                                    {p.price !== 'Custom' && <span className="text-xs text-gray-400 ml-1">/month</span>}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2.5 text-xs sm:text-sm">
                                            <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-50">
                                                <HiCheck className="w-3 h-3 text-emerald-600" />
                                            </div>
                                            <span className="text-gray-600">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register?role=firm" className={`block text-center py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${p.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIGHT AND MODERN CTA SECTION */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-br from-violet-50/70 to-indigo-50/50 border-t border-gray-100">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-80 h-80 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #e0e7ff, transparent)', top: '-10%', right: '15%' }} />
                    <div className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #ede9fe, transparent)', bottom: '-10%', left: '10%' }} />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 bg-primary-50 text-primary-700 border border-primary-100/50">
                        <HiGlobe className="w-3.5 h-3.5 text-primary-500" /> Join 500+ CA Students Today
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Ready to Start Your CA Journey?
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mb-10 max-w-lg mx-auto">Join thousands of CA students and firms already using CAHire to make articleship placement simple.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="inline-flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all shadow-md shadow-primary-500/10 hover:-translate-y-0.5">
                            Create Free Account <HiArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/register?role=firm" className="inline-flex items-center justify-center gap-2 px-10 py-3.5 rounded-xl font-bold text-gray-700 text-xs sm:text-sm bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5">
                            Register Your Firm
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
