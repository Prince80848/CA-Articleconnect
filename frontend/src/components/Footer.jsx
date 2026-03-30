import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold">CA</span>
                            </div>
                            <span className="font-bold text-gray-900">ArticleConnect</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">Connecting CA students with top firms for articleship placements across India.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-3">For Students</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/student/jobs" className="hover:text-primary-600">Browse Jobs</Link></li>
                            <li><Link to="/register" className="hover:text-primary-600">Create Profile</Link></li>
                            <li><Link to="/student/premium" className="hover:text-primary-600">Premium Plans</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-3">For Firms</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/register" className="hover:text-primary-600">Register Firm</Link></li>
                            <li><Link to="/firm/post-job" className="hover:text-primary-600">Post Jobs</Link></li>
                            <li><Link to="/firm/billing" className="hover:text-primary-600">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                            <li><a href="#" className="hover:text-primary-600">Contact</a></li>
                            <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-gray-400">© 2024 ArticleConnect. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <a href="#" className="hover:text-primary-600">Twitter</a>
                        <a href="#" className="hover:text-primary-600">LinkedIn</a>
                        <a href="#" className="hover:text-primary-600">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
