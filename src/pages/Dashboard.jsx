import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { subscriptionAPI } from '../services/api';

/* -------------------------
   Inline SVG Icons (no libs)
   Updated with login page gradient style
   ------------------------- */

const HomeIcon = ({ className = 'neon-icon icon-sm' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <linearGradient id="g-home" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
        </defs>
        <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"
            stroke="url(#g-home)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const UserIcon = ({ className = 'neon-icon icon-sm' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <linearGradient id="g-user" x1="0" x2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
        </defs>
        <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"
            stroke="url(#g-user)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="12" cy="7" r="3" stroke="url(#g-user)" strokeWidth="1.5" fill="none" />
    </svg>
);

const CardIcon = ({ className = 'neon-icon icon-sm' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <linearGradient id="g-card" x1="0" x2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
        </defs>
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="url(#g-card)" strokeWidth="1.5" fill="none" />
        <path d="M2 10h20" stroke="url(#g-card)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const CartIcon = ({ className = 'neon-icon icon-sm' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <linearGradient id="g-cart" x1="0" x2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
        </defs>
        <path d="M3 3h2l1.6 9.59A2 2 0 0 0 8.5 15H19a2 2 0 0 0 1.97-1.75L22 7H6"
            stroke="url(#g-cart)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="9" cy="20" r="1" stroke="url(#g-cart)" strokeWidth="1.5" fill="none" />
        <circle cx="19" cy="20" r="1" stroke="url(#g-cart)" strokeWidth="1.5" fill="none" />
    </svg>
);

const BellIcon = ({ className = 'neon-icon icon-md' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <linearGradient id="g-bell" x1="0" x2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
        </defs>
        <path d="M15 17h5l-1.403-5.811A6 6 0 0 0 12 6a6 6 0 0 0-6.597 5.189L4 17h11z"
            stroke="url(#g-bell)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#g-bell)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const CheckIcon = ({ className = 'neon-icon icon-sm' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <linearGradient id="g-check" x1="0" x2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
        </defs>
        <path d="M20 6L9 17l-5-5" stroke="url(#g-check)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

/* -------------------------
   Dashboard Component - Updated with Login Page Style
   ------------------------- */

const Dashboard = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSubscription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSubscription = async () => {
        try {
            const response = await subscriptionAPI.getMy();
            setSubscription(response.data);
        } catch (error) {
            if (error?.response?.status === 404) {
                setSubscription(null);
            } else {
                console.error('Subscription fetch error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (String(status || '').toLowerCase()) {
            case 'active':
                return 'bg-green-500/20 text-green-300 border border-green-500/30';
            case 'expired':
                return 'bg-red-500/20 text-red-300 border border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
        }
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        const end = new Date(endDate);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center relative overflow-hidden">
                {/* Floating blurry orbs */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 relative z-10"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex relative overflow-hidden">

            {/* Floating blurry orbs */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

            {/* ---------------- SIDEBAR ---------------- */}
            <aside className="w-64 glass-dark border-r border-white/10 backdrop-blur-strong p-6 space-y-6 relative z-10">
                <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>

                <nav className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-gray-300 text-sm uppercase tracking-wider">Menu</p>
                        <ul className="space-y-2">
                            <li className="px-4 py-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition flex items-center gap-3 border border-white/10 hover-lift">
                                <HomeIcon />
                                <span className="text-gray-200">Overview</span>
                            </li>
                            <li className="px-4 py-3 hover:bg-white/10 rounded-lg cursor-pointer transition flex items-center gap-3 border border-transparent hover:border-white/10 hover-lift">
                                <UserIcon />
                                <span className="text-gray-200">Profile</span>
                            </li>
                            <li className="px-4 py-3 hover:bg-white/10 rounded-lg cursor-pointer transition flex items-center gap-3 border border-transparent hover:border-white/10 hover-lift">
                                <CardIcon />
                                <span className="text-gray-200">Subscription</span>
                            </li>
                            <li
                                onClick={() => navigate('/plans')}
                                className="px-4 py-3 hover:bg-white/10 rounded-lg cursor-pointer transition flex items-center gap-3 border border-transparent hover:border-white/10 hover-lift"
                            >
                                <CartIcon />
                                <span className="text-gray-200">Plans</span>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* ---------------- MAIN AREA ---------------- */}
            <main className="flex-1 p-8 relative z-10">

                {/* ----------- TOP NAV ----------- */}
                <div className="flex items-center justify-between mb-8">
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/80 focus:outline-none backdrop-blur-md hover-lift"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="p-2 hover:bg-white/10 rounded-lg transition cursor-pointer border border-transparent hover:border-white/10 hover-lift">
                            <BellIcon />
                        </div>
                        <div className="p-2 hover:bg-white/10 rounded-lg transition cursor-pointer border border-transparent hover:border-white/10 hover-lift">
                            <UserIcon className="neon-icon icon-lg" />
                        </div>
                    </div>
                </div>

                {/* ----------- GRID LAYOUT ----------- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Profile Card */}
                    <div className="glass-dark rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up">
                        <h2 className="text-2xl font-semibold mb-6 gradient-text">Profile Information</h2>

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm text-gray-300">Name</label>
                                <p className="text-xl font-medium text-gray-100">{user?.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Email</label>
                                <p className="text-xl font-medium text-gray-100">{user?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Role</label>
                                <p className="text-xl font-medium text-gray-100 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Card */}
                    <div className="glass-dark rounded-2xl p-8 border border-white/10 shadow-2xl hover-lift backdrop-blur-strong animate-slide-up animation-delay-200">
                        <h2 className="text-2xl font-semibold mb-6 gradient-text">Subscription Status</h2>

                        {subscription ? (
                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm text-gray-300">Current Plan</p>
                                    <p className="text-3xl font-bold text-gray-100">{subscription.plan?.name}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(subscription.status)}`}>
                                        {subscription.status}
                                    </span>

                                    {String(subscription.status).toLowerCase() === 'active' && (
                                        <span className="text-gray-300">
                                            {getDaysRemaining(subscription.end_date)} days left
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-gray-300 text-sm">Start Date</p>
                                        <p className="text-gray-100">{new Date(subscription.start_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-sm">End Date</p>
                                        <p className="text-gray-100">{new Date(subscription.end_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-300 text-lg mb-4">
                                    No active subscription
                                </p>
                                <button
                                    onClick={() => navigate('/plans')}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover-lift glow-on-hover btn-3d transition-all"
                                >
                                    View Plans
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                {subscription?.plan?.features && (
                    <div className="mt-8 glass-dark rounded-2xl p-8 border border-white/10 shadow-2xl backdrop-blur-strong animate-slide-up animation-delay-300">
                        <h2 className="text-2xl font-semibold gradient-text mb-6">Plan Features</h2>

                        <ul className="grid md:grid-cols-2 gap-4">
                            {subscription.plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-gray-300 hover:text-gray-100 transition">
                                    <CheckIcon />
                                    <span className="ml-3">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;